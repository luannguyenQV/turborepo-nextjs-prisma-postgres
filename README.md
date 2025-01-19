<p align="center">
    <a href="https://codeforstartup.com/">
        <img src="./images/home-screen.png">
        <h1 align="center" style="color: red">NEXT FORUM</h1>
    </a>
</p>

# About next-forum

next-form is a minimal next-forum build with nextjs with AI

# About technology

- This project uses [Turborepo](https://turbo.build/) alongside [Next.js](https://nextjs.org/).
- The database is powered by PostgreSQL, managed with [Prisma](https://www.prisma.io/).
- The user interface is styled using [TailwindCSS](https://tailwindcss.com/) for utility-first CSS and [shadcn/ui](https://shadcn.dev/) for component design.

# Libraries

- ReactJS - 19.
- TypeScript
- NextJS 15. - App router and server actions
- next-auth 5.
- Prisma ORM
- Postgres
- Turborepo
- TailwindCSS
- shadcn
- next-themes
- Zod validation
- React Form Hook
- Tsup
- EditorJs
- react-toastify
- react-textarea-autosize
- lucide-react icon
- dayjs
- Eslint
- Husky
- Prettier

# Installation

Install

```
turbo install
```

In the `apps/web` folder, copy the env.example to env.local and enter the environment values

In the `packages/database`, copy the env.example to .env and enter the DATABASE_URL

Migration

```
db:migrate
```

Start

```
turbo dev
```

# Folder structure

## Front side functions

- [x] Register by email or github
- [x] Login by email, github or magic link
- [x] User logout
- [x] CRUD post
- [x] List post: Search & filter by top or hot week, month, year, infinity
- [x] Like post
- [ ] Comment on post
- [x] Share post
- [x] Manage tag
- [x] Follow user
- [x] Multiple theme & dark mode or light mode
- [x] Multiple language
- [x] Follow tag
- [x] Manage user profile
- [ ] Multiple type: post/question

## Admin functions

- [x] Dashboard
- [x] CRUD tags
- [ ] CRUD users
- [ ] Manage posts
- [ ] Manage images
- [ ] Settings: Header/Menu
- [ ] Manage roles and permission
