"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function Page() {
	const params = useParams();

	const [newCommentText, setNewCommentText] = useState("");

	const postId = Number(params.postId);

	const { data: postApiData } = useQuery({
		queryKey: ["post", postId],
		queryFn: async () => {
			return axios.get(`/api/post/${postId}`);
		},
	});

	const { data: commentsApiData, refetch: refetchComments } = useQuery({
		queryKey: ["comment", postId],
		queryFn: async () => {
			return axios.get(`/api/comment/${postId}`);
		},
	});

	const postData = useMemo(() => {
		if (postApiData?.data.post) {
			return postApiData?.data.post as any;
		}
		return null;
	}, [postApiData]);

	const createCommentMutation = useMutation({
		mutationFn: (data: { content: string; postId: number }) => {
			return axios.post(`/api/comment`, data);
		},
		onSuccess: (data) => {
			refetchComments();
			setNewCommentText("");
		},
	});

	function onAddComment() {
		const data = { content: newCommentText, postId };
		createCommentMutation.mutate(data);
	}

	if (!postData) {
		return <div>loading...</div>;
	}

	return (
		<div className="flex flex-col p-2">
			<div className="flex flex-col border p-1">
				<div>@{postData.author.userHandle}</div>
				<div>{postData.content}</div>
			</div>

			<div className="p-2 flex flex-col gap-2">
				<Textarea
					placeholder="add a new comment"
					value={newCommentText}
					onChange={(e) => setNewCommentText(e.target.value)}
				/>
				<Button
					onClick={onAddComment}
					disabled={
						createCommentMutation.isLoading || newCommentText.length === 0
					}
				>
					{createCommentMutation.isLoading ? "Creating..." : "Add"}
				</Button>
			</div>

			<div>Comments - </div>
			{commentsApiData?.data.comments && (
				<>
					{commentsApiData?.data.comments.map((item: any) => {
						return (
							<div
								className="flex flex-col border p-1"
								key={`comment-${item.id}`}
							>
								<div>Comment by @{item.author.userHandle}</div>
								<div>{item.content}</div>
							</div>
						);
					})}
				</>
			)}
		</div>
	);
}
