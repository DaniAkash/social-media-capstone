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
		const currentUserProfileData = await prisma.profile.findFirst({
			where: {
				id: Number(tokenPayload.payload.profileId),
			},
			include: {
				currentUsers: true,
			},
		});

		const posts = await prisma.post.findMany({
			where: {
				author: {
					id: {
						in:
							currentUserProfileData?.currentUsers.map(
								(item) => item.followingId
							) || [],
					},
				},
			},
			select: {
				id: true,
				createdAt: true,
				title: true,
				content: true,
				author: {
					select: {
						name: true,
						userHandle: true,
					},
				},
			},
		});

		return NextResponse.json(
			{ message: "success", posts: posts },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Something went wrong" },
			{ status: 500 }
		);
	}
}
