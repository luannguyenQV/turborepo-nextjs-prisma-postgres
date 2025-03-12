import { Prisma } from "@prisma/client"

export const PostSelect = {
  id: true,
  title: true,
  content: true,
  slug: true,
  postStatus: true,
  createdAt: true,
  updatedAt: true,
  upVotesCount: true,
  downVotesCount: true,
  viewCount: true,
  likesCount: true,
  commentsCount: true,
  sharesCount: true,
  author: {
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
  tagOnPost: {
    select: {
      tag: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  },
} satisfies Prisma.PostSelect

export type TPostItem = Prisma.PostGetPayload<{
  select: typeof PostSelect
}>

