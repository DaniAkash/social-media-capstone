"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const formSchema = z.object({
	title: z.string().min(1, {
		message: "Title must be at least 1 character.",
	}),
	content: z.string().min(1).max(200, {
		message: "Content can be only 100 characters long",
	}),
});

export default function Page() {
	const createPostMutation = useMutation({
		mutationFn: (data: z.infer<typeof formSchema>) => {
			return axios.post(`/api/create-post`, data);
		},
		onSuccess: (data) => {
			console.log(data);
			// if (data.data.profileCompleted) {
			// 	router.replace("/feed");
			// } else {
			// 	if (data.data.error) {
			// 		setFormCustomError(data.data.error as string);
			// 	}
			// }
		},
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			content: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		createPostMutation.mutate(values);
		console.log(values);
	}

	return (
		<div className="flex flex-col max-w-[500px] mx-auto mt-10 gap-8">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input type="text" placeholder="title" {...field} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Content</FormLabel>
								<FormControl>
									<Textarea placeholder="post content" {...field} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" disabled={createPostMutation.isLoading}>
						{createPostMutation.isLoading ? "Creatig post..." : "Submit"}
					</Button>

					{createPostMutation.isError && (
						<FormDescription className="text-destructive-foreground bg-destructive p-2 rounded-sm max-w-[max-content]">
							Something went wrong
						</FormDescription>
					)}
				</form>
			</Form>
		</div>
	);
}
