"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useMemo } from "react";

export default function Page() {
	const { data: feedApiData } = useQuery({
		queryKey: ["profile"],
		queryFn: async () => {
			return axios.get(`/api/feed`);
		},
	});

	const posts = useMemo(() => {
		if (feedApiData?.data.posts) {
			return feedApiData?.data.posts as any[];
		}
		return [];
	}, [feedApiData]);

	return (
		<div className="flex flex-col gap-2 m-3">
			Feed
			{posts.map((item) => {
				return (
					<Link href={`post/${item.id}`} key={`post-${item.id}`}>
						<div className="flex flex-col border p-1">
							<div>@{item.author.userHandle}</div>
							<div>{item.content}</div>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
