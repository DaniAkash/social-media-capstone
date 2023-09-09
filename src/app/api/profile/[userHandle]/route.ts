import { prisma } from "@/lib/db";
import { verify } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	context: { params: { userHandle: string } }
) {
	const { userHandle } = context.params;
	const token = cookies().get("token")?.value || "";

	const verifiedToken = await verify(token);

	if (!verifiedToken) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const profile = await prisma.profile.findFirst({
			where: {
				userHandle: {
					equals: userHandle,
				},
			},
			include: {
				user: true,
				posts: true,
				currentUsers: true,
				following: true,
			},
		});

		let isLoggedInUserFollowing = false;

		if (profile) {
			if (
				profile.following.findIndex(
					(item) =>
						item.currentUserId === Number(verifiedToken.payload.profileId)
				) >= 0
			) {
				isLoggedInUserFollowing = true;
			}
			return NextResponse.json(
				{
					user: {
						email: profile.user.email,
						bio: profile.bio,
						name: profile.name,
						userHandle: profile.userHandle,
						profilePic: profile.profilePic || "",
						posts: profile.posts,
						isLoggedInUserFollowing,
						profileId: profile.id,
						followers: profile.following,
						following: profile.currentUsers,
					},
				},
				{ status: 200 }
			);
		}
		return NextResponse.json({ message: "user not found" }, { status: 404 });
	} catch (error) {
		return NextResponse.json(
			{ message: "Something went wrong" },
			{ status: 500 }
		);
	}
}
