"use client";

import ProfilePage from "@/components/ProfilePage/ProfilePage";
import { UserProfile } from "@/types/profile";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";

export default function Page() {
	const { data: userApiData } = useQuery({
		queryKey: ["profile"],
		queryFn: async () => {
			return axios.get(`/api/profile`);
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

	return <ProfilePage data={profileData} isEditable={true} />;
}
