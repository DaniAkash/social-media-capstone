import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: { postId: string } }
) {
	const postId = Number(params.postId);

	try {
		const allComments = await prisma.comment.findMany({
			where: {
				postId: {
					equals: postId,
				},
			},
			select: {
				id: true,
				content: true,
				createdAt: true,
				author: {
					select: {
						userHandle: true,
					},
				},
			},
		});

		return NextResponse.json(
			{ message: "success", comments: allComments },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error in retreiving comments", error);
		return NextResponse.json(
			{ message: "Something went wrong" },
			{ status: 500 }
		);
	}
}
