import { prisma } from "@/lib/db";
import { verify } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { postId, content } = await req.json();

	if (!postId || !content) {
		return NextResponse.json({ error: "Invalid data" }, { status: 400 });
	}

	const cookieStore = cookies();
	const token = cookieStore.get("token")?.value || "";
	if (!token) {
		return NextResponse.json({ message: "forbidden" }, { status: 401 });
	}
	const tokenPayload = await verify(token);

	if (!tokenPayload)
		return NextResponse.json({ message: "forbidden" }, { status: 401 });

	const profileId = Number(tokenPayload.payload.profileId);

	try {
		const newComment = await prisma.comment.create({
			data: {
				content,
				postId,
				authorId: profileId,
			},
		});

		return NextResponse.json(
			{ message: "Comment added", comment: newComment },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error in comment creation", error);
		return NextResponse.json(
			{ message: "Something went wrong" },
			{ status: 500 }
		);
	}
}
