import { prisma } from "@/lib/db";
import { verify } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
	const cookieStore = cookies();

	const token = cookieStore.get("token")?.value as string;

	if (!token) {
		return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
	}
	const tokenPayload = await verify(token);

	if (!tokenPayload) {
		return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
	}

	try {
		const profile = await prisma.profile.findFirst({
			where: {
				id: {
					equals: Number(tokenPayload.payload.profileId),
				},
			},
			include: {
				user: true,
				posts: true,
				currentUsers: true,
				following: true,
			},
		});
		// const user = await prisma.user.findFirst({
		// 	where: {
		// 		email: {
		// 			equals: tokenPayload.payload.email as string,
		// 		},
		// 	},
		// 	include: {
		// 		profile: true,
		// 	},
		// });

		if (profile) {
			return NextResponse.json(
				{
					user: {
						email: profile.user.email,
						bio: profile.bio || "",
						name: profile.name || "",
						userHandle: profile.userHandle || "",
						profilePic: profile.profilePic || "",
						posts: profile.posts,
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
