"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function FollowButton({
	profileId,
	isFollowing: isFollowingProp = false,
	refreshProfile,
}: {
	profileId: number;
	isFollowing: boolean;
	refreshProfile?: () => void;
}) {
	const [isFollowing, setIsFollowing] = useState(isFollowingProp);

	const followUserMutation = useMutation({
		mutationFn: () => {
			return axios.post(`/api/follow`, {
				profileId,
			});
		},
		onSuccess: () => {
			if (refreshProfile) {
				refreshProfile();
			}
		},
	});

	return (
		<Button
			onClick={() => {
				setIsFollowing((prev) => !prev);
				// API call here
				followUserMutation.mutate();
			}}
		>
			{isFollowing ? "Following" : "Follow"}
		</Button>
	);
}
