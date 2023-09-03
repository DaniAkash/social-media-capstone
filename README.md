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

TODO -

1. Middleware for protected routes
2. Nav bar
