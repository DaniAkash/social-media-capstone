This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Social Media App

This is a general purpose social media app

## Key features of the App

- User Profile
  - Profile Page
  - Login mechanism
- User generate posts
  - Feed
  - Post creation page
- Followers
  - Visit profile pages using readonly mode
- Like & comment system

## Tech Stack

- Next.js with App Dir
- Next Auth
- Prisma
- Postgres
- Shadcn UI

## Page routes

- Login
  - /login
- Feed
  - /feed
- Profile
  - /profile
  - /profile/[userHandle]
- Home page
  - Acts as a redirection page
    - If logged in => redirect to /feed
    - If not logged in => redirect to /login

# Login + Bio flow

- User logs into the app
  - Set JWT token
    - Check if user has profile
      - Yes
        - Redirect the user to `/feed` page
      - No
        - Redirect the user to `/create-profile` page
          - Form to create profile -> user_handle, name, bio
            - Redirect the user to `/feed` page
- Create the `/profile` page
  - User can see thier own profile
- Create the `/profile/[userHande]`
  - User can see other's profile

# Post creation + Feed

- User visits Profile page

  - CTA: Create a post
  - `/create-post` -> create a new post with title & content
  - Once it is created redirect user to `/profile` page

- In the `/profile` page

  - We'll add user's personal feed with their own posts

- In the `profile/[userHandle]` page
  - We will display the posts of the target user

# After setting up follow relation

- If we want to get all the followers for a giver user

```js
const profileWithFollowers = await prisma.profile.findUnique({
	where: {
		id: profileId,
	},
	include: {
		followers: {
			select: {
				follower: {
					select: {
						id: true,
						bio: true,
						// include any other fields from the Profile model that you want
					},
				},
			},
		},
	},
});
```

- If I want to query all the posts created by profiles I am following

```js
// Get all the profiles I am following
const followingProfiles = await prisma.profile.findUnique({
	where: { userId: userId },
	include: {
		following: {
			select: {
				followingId: true,
			},
		},
	},
});

// Using this you can build the feed
// Using the posts query, and SQL's `in` operator
const posts = await prisma.post.findMany({
	where: {
		author: {
			profile: {
				id: {
					in: followingIds,
				},
			},
		},
	},
	// Include any other fields that you want from the Post model
	select: {
		id: true,
		title: true,
		content: true,
		createdAt: true,
		updatedAt: true,
	},
});
```

## Implementing the follow feature & the General Home Feed

- User can visit other user and click follow -> the button will turn follow to following
- Display follower count anf following count on all profile pages
- Display all the posts fro accounts you are following on the feed page

## Implementing a comment system

- User can click on a feed & go to the individual post page

  - /post/[postId]
  - Input field to create a new comment
  - CTA to add a like to the post

- APIs that we will need
  - POST /api/comment - create a new comment for post
  - GET /api/comment/[postId] - get all comments for a post
  - POST /api/like - like/unlike a comment
  - GET /api/like/[postId] - get count of all likes on the post (with if currentUser has liked it)
