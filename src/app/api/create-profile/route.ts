import { prisma } from "@/lib/db";
import { verify } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { name, bio, userHandle } = await req.json();

	if (!name || !userHandle) {
		return NextResponse.json({ error: "Invalid data" }, { status: 400 });
	}

	const cookieStore = cookies();
	const token = cookieStore.get("token")?.value;

	if (!token) {
		return NextResponse.json({ message: "Not authenticated" }, { status: 403 });
	}

	const verifiedTokenData = await verify(token);

	if (!verifiedTokenData) {
		return NextResponse.json({ message: "Not authenticated" }, { status: 403 });
	}

	try {
		const requestedUser = await prisma.user.findFirst({
			where: {
				email: {
					equals: verifiedTokenData.payload.email as string,
				},
			},
			include: {
				profile: true,
			},
		});
		if (requestedUser && requestedUser.profile) {
			return NextResponse.json(
				{ error: "Profile Already created" },
				{ status: 200 }
			);
		}
		const requestedUserProfile = await prisma.profile.findFirst({
			where: {
				userHandle: {
					equals: userHandle,
					mode: "insensitive",
				},
			},
			include: {
				user: true,
			},
		});

		if (requestedUserProfile) {
			//  userhandle not available;
			return NextResponse.json(
				{ error: "User Handle not available", profileCompleted: false },
				{ status: 200 }
			);
		}

		const newProfile = await prisma.profile.create({
			data: {
				name,
				userHandle,
				bio,
				user: {
					connect: {
						id: verifiedTokenData.payload.id as number,
					},
				},
			},
		});

		return NextResponse.json(
			{ message: "Profile completed", profileCompleted: true },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{
				error: "Something went wrong",
			},
			{ status: 500 }
		);
	}
}
