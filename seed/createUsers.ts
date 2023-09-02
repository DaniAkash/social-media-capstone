import { prisma } from "@/lib/db";
import { hash } from "@/lib/hash";

async function createUsers(email: string, password: string) {
	const passwordHash = await hash(password);
	const user = await prisma.user.findFirst({
		where: {
			email: {
				equals: email,
			},
		},
	});

	if (user) {
		return `User with this email already exists`;
	}

	await prisma.user.create({
		data: {
			email: email,
			password: passwordHash,
			authType: "PASSWORD",
		},
	});
}

export function createSeed() {
	const sampleUsers = [
		{ email: "user1@test.com", password: "bar" },
		{ email: "user2@test.com", password: "bar" },
		{ email: "user3@test.com", password: "bar" },
		{ email: "user4@test.com", password: "bar" },
		{ email: "user5@test.com", password: "bar" },
		{ email: "user6@test.com", password: "bar" },
		{ email: "user7@test.com", password: "bar" },
		{ email: "user8@test.com", password: "bar" },
		{ email: "user9@test.com", password: "bar" },
		{ email: "user10@test.com", password: "bar" },
	];

	sampleUsers.forEach((item) => createUsers(item.email, item.password));
}

/**
 
	const adminPassword = "124567890";
	const passwordHash = await hash(adminPassword);

	const email = "admin@test.com";

	const admin = await prisma.admin.findFirst({
		where: {
			email: {
				equals: email,
			},
		},
	});

	if (admin) {
		return "Admin already exists";
	}

	await prisma.admin.create({
		data: {
			email: email,
			password: passwordHash,
		},
	});

	return "Created admin user";
 */
