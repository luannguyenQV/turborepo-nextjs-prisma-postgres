import { Prisma } from "@prisma/client"

export const UserSelect = {
  id: true,
  username: true,
  firstName: true,
  lastName: true,
  email: true,
  bio: true,
  userStatus: true,
  trustLevel: true,
  lastSeenAt: true,
  createdAt: true,
  updatedAt: true,
  isAdmin: true,
  isModerator: true,
  totalFollowers: true,
  totalFollowing: true,
  blockedUntil: true,
  blockReason: true,
  lastLoginAt: true,
  loginAttempts: true,
  _count: {
    select: {
      posts: true,
      comments: true,
      followers: true,
      followings: true,
    },
  },
} satisfies Prisma.UserSelect

export type TUserItem = Prisma.UserGetPayload<{
  select: typeof UserSelect
}>

export const UserDetailSelect = {
  id: true,
  username: true,
  firstName: true,
  lastName: true,
  email: true,
  bio: true,
  userStatus: true,
  trustLevel: true,
  lastSeenAt: true,
  createdAt: true,
  updatedAt: true,
  isAdmin: true,
  isModerator: true,
  totalFollowers: true,
  totalFollowing: true,
  blockedUntil: true,
  blockReason: true,
  lastLoginAt: true,
  loginAttempts: true,
  password: true,
  _count: {
    select: {
      posts: true,
      comments: true,
      followers: true,
      followings: true,
      badges: true,
      media: true,
    },
  },
} satisfies Prisma.UserSelect

export type TUserDetail = Prisma.UserGetPayload<{
  select: typeof UserDetailSelect
}>

// For backward compatibility
export const userSelect = UserSelect
export const userDetailSelect = UserDetailSelect
