"use client";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
	name: z.string().min(2, {
		message: "Email must be at least 2 characters.",
	}),
	bio: z.string().min(0).max(20, {
		message: "Bio can be only 20 characters long",
	}),
	userHandle: z
		.string()
		.min(2, {
			message: "User handle must be atleast 20 characters long",
		})
		.max(20, {
			message: "User handle can be only 20 characters long",
		}),
});

export default function Page() {
	const [formCustomError, setFormCustomError] = useState("");
	const router = useRouter();

	const createProfileMutation = useMutation({
		mutationFn: (data: z.infer<typeof formSchema>) => {
			return axios.post(
				`${process.env.NEXT_PUBLIC_SITE_URL}/api/create-profile`,
				data
			);
		},
		onSuccess: (data) => {
			console.log(data);
			if (data.data.profileCompleted) {
				router.replace("/feed");
			} else {
				if (data.data.error) {
					setFormCustomError(data.data.error as string);
				}
			}
		},
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			bio: "",
			userHandle: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			createProfileMutation.mutate(values);
		} catch (error) {
			console.error("Error in Login", error);
		}
	}

	return (
		<div className="flex flex-col max-w-[500px] mx-4 md:mx-auto min-h-screen justify-center">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder="shadcn" {...field} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="bio"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Bio</FormLabel>
								<FormControl>
									<Input {...field} type="text" />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="userHandle"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Handle</FormLabel>
								<FormControl>
									<Input {...field} type="text" />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" disabled={createProfileMutation.isLoading}>
						{createProfileMutation.isLoading ? "Verifying..." : "Submit"}
					</Button>
					{createProfileMutation.isError && (
						<FormDescription className="text-destructive-foreground bg-destructive p-2 rounded-sm max-w-[max-content]">
							Something went wrong
						</FormDescription>
					)}
					{formCustomError && (
						<FormDescription className="text-destructive-foreground bg-destructive p-2 rounded-sm max-w-[max-content]">
							{formCustomError}
						</FormDescription>
					)}
				</form>
			</Form>
		</div>
	);
}
