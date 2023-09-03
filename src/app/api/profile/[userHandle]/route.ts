import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	context: { params: { userHandle: string } }
) {
	const { userHandle } = context.params;

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
			},
		});

		if (profile) {
			return NextResponse.json(
				{
					user: {
						email: profile.user.email,
						bio: profile.bio,
						name: profile.name,
						userHandle: profile.userHandle,
						profilePic: profile.profilePic || "",
						posts: profile.posts,
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
