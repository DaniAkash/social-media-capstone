import * as jose from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const sign = async (payload: any) => {
	const alg = "HS256";

	const jwt = await new jose.SignJWT(payload)
		.setProtectedHeader({ alg })
		.setIssuedAt()
		.setIssuer("urn:example:issuer")
		.setAudience("urn:example:audience")
		.setExpirationTime("1h")
		.sign(secret);

	return jwt;
};

export const verify = async (token: string) => {
	try {
		const data = await jose.jwtVerify(token, secret, {
			issuer: "urn:example:issuer",
			audience: "urn:example:audience",
		});
		return data;
	} catch (e) {
		console.error(e);
		return false;
	}
};
