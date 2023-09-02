import ProfilePage from "@/components/ProfilePage/ProfilePage";
import { UserProfile } from "@/types/profile";
import axios from "axios";

export default async function Page({
	params,
}: {
	params: { userHandle: string };
}) {
	const { userHandle } = params;

	let profileData: null | UserProfile = null;

	try {
		const data = await axios.get(
			`${process.env.NEXT_PUBLIC_SITE_URL}/api/user-data/${userHandle}`
		);

		if (data.data.user) {
			profileData = data.data.user as UserProfile;
		}
	} catch (error) {}

	if (!profileData) {
		return <div>Data not found</div>;
	}

	return <ProfilePage data={profileData} />;
}
