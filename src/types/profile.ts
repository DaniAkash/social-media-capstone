export interface UserProfile {
	bio: string;
	email: string;
	name: string;
	profilePic: string;
	userHandle: string;
	posts: Post[];
	isLoggedInUserFollowing?: boolean;
}

export interface Post {
	id: number;
	createdAt: string;
	updatedAt: string;
	title: string;
	content: string;
	published: boolean;
	authorId: number;
}
