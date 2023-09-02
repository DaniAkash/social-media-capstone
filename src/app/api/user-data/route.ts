import { prisma } from "@/lib/db";
import { verify } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
	const cookieStore = cookies();

	const token = cookieStore.get("token")?.value as string;

	if (!token) {
		return NextResponse.json({ message: "Not authenticated" }, { status: 403 });
	}
	const tokenPayload = await verify(token);

	if (!tokenPayload) {
		return NextResponse.json({ message: "Not authenticated" }, { status: 403 });
	}

	try {
		const user = await prisma.user.findFirst({
			where: {
				email: {
					equals: tokenPayload.payload.email as string,
				},
			},
			include: {
				profile: true,
			},
		});

		if (user) {
			return NextResponse.json(
				{
					user: {
						email: user.email,
						bio: user.profile?.bio || "",
						name: user.profile?.name || "",
						userHandle: user.profile?.userHandle || "",
						profilePic: user.profile?.profilePic || "",
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
