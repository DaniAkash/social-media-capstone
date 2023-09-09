import { prisma } from "@/lib/db";
import { verify } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { userId, followStatus } = await req.json();

	if (!userId || !followStatus) {
		return NextResponse.json({ error: "Invalid data" }, { status: 400 });
	}

	const cookieStore = cookies();
	const token = cookieStore.get("token")?.value || "";
	if (!token) {
		return NextResponse.json({ message: "unauthorized" }, { status: 401 });
	}
	const tokenPayload = await verify(token);

	if (!tokenPayload)
		return NextResponse.json({ message: "unauthorized" }, { status: 401 });

	const profileId = Number(tokenPayload.payload.profileId);

	// const followData = await prisma.follow.findFirst({
	//     where: {

	//     }
	// })

	// return NextResponse.json(
	// 	{ message: "success", data: newPost },
	// 	{ status: 200 }
	// );
}
