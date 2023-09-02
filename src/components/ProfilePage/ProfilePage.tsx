"use client";

import { UserProfile } from "@/types/profile";

export default function ProfilePage({ data }: { data: UserProfile }) {
	return (
		<div className="flex flex-col border-2 border-primary-foreground flex-1 max-h-[max-content]">
			<div className="flex gap-1 items-end">
				<span className="text-3xl font-bold">{data.name}</span>
				<span>@{data.userHandle}</span>
			</div>
			<div>{data.bio}</div>
		</div>
	);
}
