import { prisma } from "@/lib/db";
import { verify } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { title, content } = await req.json();
	const cookieStore = cookies();
	const token = cookieStore.get("token")?.value || "";
	if (!token) {
		return NextResponse.json({ message: "forbidden" }, { status: 401 });
	}
	const tokenPayload = await verify(token);

	if (!tokenPayload)
		return NextResponse.json({ message: "forbidden" }, { status: 401 });

	const profileId = Number(tokenPayload.payload.profileId);

	const newPost = await prisma.post.create({
		data: {
			title,
			content,
			published: true,
			authorId: profileId,
		},
	});

	return NextResponse.json(
		{ message: "success", data: newPost },
		{ status: 200 }
	);
}
