import { prisma } from "@/lib/db";
import { verify } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { profileId } = await req.json();
	console.log("======profileId", profileId);
	if (!profileId) {
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

	const currentUserProfileId = Number(tokenPayload.payload.profileId);

	const followData = await prisma.follow.findFirst({
		where: {
			AND: [
				{
					followingId: {
						equals: profileId,
					},
				},
				{
					currentUserId: {
						equals: currentUserProfileId,
					},
				},
			],
		},
	});

	console.log("FOLLOW DATA", followData);
	if (followData) {
		await prisma.follow.delete({
			where: {
				id: followData.id,
			},
		});

		return NextResponse.json({ message: "unfollowed" }, { status: 200 });
	}

	// follow
	const newFollow = await prisma.follow.create({
		data: {
			followingId: profileId,
			currentUserId: currentUserProfileId,
		},
	});

	console.log("=====newFollow", newFollow);

	return NextResponse.json({ message: "followed" }, { status: 200 });
}
