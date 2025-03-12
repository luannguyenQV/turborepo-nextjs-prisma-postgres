import { Prisma } from "@prisma/client"

export const TagSelect = {
  id: true,
  name: true,
  slug: true,
  type: true,
  createdById: true,
  parentTagId: true,
  mediaId: true,
  media: {
    select: {
      id: true,
      url: true,
    },
  },
  creator: {
    select: {
      id: true,
      username: true,
    },
  },
  _count: {
    select: {
      tagOnPost: true,
      userOnTag: true,
    },
  },
} satisfies Prisma.TagSelect

export type TTagItem = Prisma.TagGetPayload<{
  select: typeof TagSelect
}>

export const TagListSelect = {
  id: true,
  name: true,
  slug: true,
  type: true,
  createdById: true,
  mediaId: true,
  media: {
    select: {
      id: true,
      url: true,
    },
  },
  _count: {
    select: {
      tagOnPost: true,
    },
  },
} satisfies Prisma.TagSelect

export type TTagListItem = Prisma.TagGetPayload<{
  select: typeof TagListSelect
}>

// For backward compatibility
export const tagItemSelect = TagSelect
export const tagListSelect = TagListSelect
