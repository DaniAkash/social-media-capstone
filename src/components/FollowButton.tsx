"use client";

import { useState } from "react";
import { Button } from "./ui/button";

export default function FollowButton({
	isFollowing: isFollowingProp = false,
}: {
	isFollowing: boolean;
}) {
	const [isFollowing, setIsFollowing] = useState(isFollowingProp);
	return (
		<Button
			onClick={() => {
				setIsFollowing((prev) => !prev);
				// API call here
			}}
		>
			{isFollowing ? "Following" : "Follow"}
		</Button>
	);
}
