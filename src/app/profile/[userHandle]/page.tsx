"use client";

import ProfilePage from "@/components/ProfilePage/ProfilePage";
import { UserProfile } from "@/types/profile";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function Page() {
	const params = useParams();
	const { userHandle } = params;
	const { data: userApiData } = useQuery({
		queryKey: ["profile"],
		queryFn: async () => {
			return axios.get(`/api/profile/${userHandle}`);
		},
	});

	const profileData = useMemo(() => {
		if (userApiData?.data.user) {
			return userApiData?.data.user as UserProfile;
		}
		return null;
	}, [userApiData]);

	if (!profileData) {
		return <></>;
	}

	return <ProfilePage data={profileData} />;
}
