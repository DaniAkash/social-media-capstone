"use client";

import ProfilePage from "@/components/ProfilePage/ProfilePage";
import { UserProfile } from "@/types/profile";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";

export default function Page() {
	const { data: userApiData } = useQuery({
		queryKey: ["user-data"],
		queryFn: async () => {
			return axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/user-data`);
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
