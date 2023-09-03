import { prisma } from "@/lib/db";
import { compare } from "@/lib/hash";
import { sign } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
	const { email, password } = await req.json();
	if (!email || !password) {
		return NextResponse.json({ error: "Invalid data" }, { status: 400 });
	}

	try {
		const requestedUser = await prisma.user.findFirst({
			where: {
				email: {
					equals: email,
				},
			},
			include: {
				profile: true,
			},
		});

		if (!requestedUser) {
			return NextResponse.json(
				{
					error: "Invalid Credentials",
				},
				{ status: 400 }
			);
		}

		if (requestedUser.authType !== "PASSWORD" || !requestedUser.password) {
			return NextResponse.json(
				{
					error: "Invalid Credentials",
				},
				{ status: 400 }
			);
		}

		const isPasswordValid = await compare(requestedUser.password, password);

		if (!isPasswordValid) {
			return NextResponse.json(
				{
					error: "Invalid Credentials",
				},
				{ status: 400 }
			);
		}

		const token = await sign({
			email: requestedUser.email,
			id: requestedUser.id,
			profileId: requestedUser.profile?.id || null,
		});

		const onwMonth = 30 * 24 * 60 * 60 * 1000;

		cookies().set({
			name: "token",
			value: token,
			httpOnly: true,
			expires: Date.now() + onwMonth,
		});

		return NextResponse.json(
			{
				message: "User Logged In",
				redirect: requestedUser.profile ? "feed" : "create-profile",
				token: token,
			},
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
