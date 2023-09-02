import { NextResponse } from "next/server";
import { createSeed } from "../../../../seed/createUsers";

export async function GET() {
	createSeed();
	return NextResponse.json({ message: "seed executed" }, { status: 200 });
}
