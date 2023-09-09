// /profile/search?q=“user”

import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const searchQuery = request.nextUrl.searchParams.get("q") || "";

	if (!searchQuery) {
		return NextResponse.json({ message: "Invalid query" }, { status: 400 });
	}

	try {
		const result = await prisma.profile.findMany({
			where: {
				userHandle: {
					search: searchQuery,
				},
			},
		});

		return NextResponse.json({ message: "success", result }, { status: 200 });
	} catch (error) {
		console.error("Error finding search results", error);
		return NextResponse.json({ message: "Error" }, { status: 500 });
	}
}
