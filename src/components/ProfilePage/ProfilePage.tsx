"use client";

import { UserProfile } from "@/types/profile";
import Link from "next/link";

export default function ProfilePage({
	data,
	isEditable = false,
}: {
	data: UserProfile;
	isEditable?: boolean;
}) {
	return (
		<div className="flex flex-col">
			<div className="flex flex-col border-2 border-primary-foreground flex-1 max-h-[max-content] gap-2">
				<div className="flex gap-1 items-end">
					<span className="text-3xl font-bold">{data.name}</span>
					<span>@{data.userHandle}</span>
				</div>
				<div>{data.bio}</div>
				{isEditable && (
					<Link
						href="/create-post"
						className="bg-primary text-primary-foreground max-w-[max-content] p-2 rounded-sm font-medium"
					>
						Create post
					</Link>
				)}
			</div>

			{/* feed */}
			<div>Posts</div>
			{data.posts.map((item) => (
				<div className="flex flex-col" key={`post-${item.id}`}>
					<div>{item.title}</div>
					<div>{item.content}</div>
				</div>
			))}
		</div>
	);
}
