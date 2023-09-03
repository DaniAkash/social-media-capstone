import { NextRequest, NextResponse } from "next/server";
import { verify } from "./lib/jwt";

const protectedRoutes = [
	"/profile",
	"/feed",
	"/api/profile",
	"/api/feed",
	"/api/follow",
];

async function isAuthenticated(req: NextRequest) {
	try {
		const token = req.cookies.get("token");
		if (!token) {
			return false;
		}
		const jwt = await verify(token.value);

		if (!jwt || !jwt.payload.id) {
			return false;
		}
		return true;
	} catch (err) {
		console.log("jwt error", err);
		return false;
	}
}

export async function middleware(req: NextRequest) {
	const requestedPathname = req.nextUrl.pathname;
	// console.log("MIDDLEWARE------", requestedPathname);

	let matchesWithAnyProtectedRoutes = false;
	for (let i = 0; i < protectedRoutes.length; i++) {
		if (requestedPathname.startsWith(protectedRoutes[i])) {
			matchesWithAnyProtectedRoutes = true;
			break;
		}
	}
	const isAuth = await isAuthenticated(req);
	// console.log("---- Auth checjk", isAuth);
	if (matchesWithAnyProtectedRoutes) {
		if (!isAuth) return NextResponse.redirect(new URL("/login", req.url));
	}
	// console.log("=== Passed middleware checks", requestedPathname);
}
