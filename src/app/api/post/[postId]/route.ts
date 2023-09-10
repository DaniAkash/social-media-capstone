import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: { postId: string } }
) {
	const postId = Number(params.postId);

	try {
		const post = await prisma.post.findFirst({
			where: {
				id: postId,
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

		return NextResponse.json({ message: "success", post }, { status: 200 });
	} catch (error) {
		console.error("Error in retreiving comments", error);
		return NextResponse.json(
			{ message: "Something went wrong" },
			{ status: 500 }
		);
	}
}
