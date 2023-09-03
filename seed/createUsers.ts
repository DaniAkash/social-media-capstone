import { prisma } from "@/lib/db";
import { hash } from "@/lib/hash";

async function createUsers(
	email: string,
	password: string,
	name: string,
	bio: string,
	userHandle: string,
	posts: { title: string; content: string }[]
) {
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

	const newUser = await prisma.user.create({
		data: {
			email: email,
			password: passwordHash,
			authType: "PASSWORD",
		},
	});

	const newProfile = await prisma.profile.create({
		data: {
			name,
			bio,
			userHandle,
			userId: newUser.id,
		},
	});

	const newPosts = await prisma.post.createMany({
		data: posts.map((item) => ({ ...item, authorId: newProfile.id })),
	});
}

export function createSeed() {
	const sampleUsers = [
		{
			email: "user1@test.com",
			password: "bar",
			userHandle: "user1",
			name: "User 1",
			bio: "user 1 bio",
		},
		{
			email: "user2@test.com",
			password: "bar",
			userHandle: "user2",
			name: "User 1",
			bio: "user 1 bio",
		},
		{
			email: "user3@test.com",
			password: "bar",
			userHandle: "user3",
			name: "User 1",
			bio: "user 1 bio",
		},
		{
			email: "user4@test.com",
			password: "bar",
			userHandle: "user4",
			name: "User 1",
			bio: "user 1 bio",
		},
		{
			email: "user5@test.com",
			password: "bar",
			userHandle: "user5",
			name: "User 1",
			bio: "user 1 bio",
		},
		{
			email: "user6@test.com",
			password: "bar",
			userHandle: "user6",
			name: "User 1",
			bio: "user 1 bio",
		},
		{
			email: "user7@test.com",
			password: "bar",
			userHandle: "user7",
			name: "User 1",
			bio: "user 1 bio",
		},
		{
			email: "user8@test.com",
			password: "bar",
			userHandle: "user8",
			name: "User 1",
			bio: "user 1 bio",
		},
		{
			email: "user9@test.com",
			password: "bar",
			userHandle: "user9",
			name: "User 1",
			bio: "user 1 bio",
		},
		{
			email: "user10@test.com",
			password: "bar",
			userHandle: "user10",
			name: "User 1",
			bio: "user 1 bio",
		},
	];

	const samplePosts = [
		{
			title: "post 1",
			content:
				"Occaecat duis Lorem dolor mollit pariatur ex commodo aliquip magna. Dolore velit nostrud fugiat minim proident sint. Qui officia ex sit quis ullamco deserunt ex dolor. Aliquip non incididunt Lorem ut proident consectetur ex. Officia consequat cupidatat elit laboris in pariatur Lorem.",
		},
		{
			title: "post 2",
			content:
				"Occaecat duis Lorem dolor mollit pariatur ex commodo aliquip magna. Dolore velit nostrud fugiat minim proident sint. Qui officia ex sit quis ullamco deserunt ex dolor. Aliquip non incididunt Lorem ut proident consectetur ex. Officia consequat cupidatat elit laboris in pariatur Lorem.",
		},
		{
			title: "post 3",
			content:
				"Occaecat duis Lorem dolor mollit pariatur ex commodo aliquip magna. Dolore velit nostrud fugiat minim proident sint. Qui officia ex sit quis ullamco deserunt ex dolor. Aliquip non incididunt Lorem ut proident consectetur ex. Officia consequat cupidatat elit laboris in pariatur Lorem.",
		},
	];

	sampleUsers.forEach((item) =>
		createUsers(
			item.email,
			item.password,
			item.name,
			item.bio,
			item.userHandle,
			samplePosts
		)
	);
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
