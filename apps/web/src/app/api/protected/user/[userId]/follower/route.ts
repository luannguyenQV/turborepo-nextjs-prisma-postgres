import { NextRequest } from "next/server"

import prisma from "database"

import { auth } from "@/configs/auth"

export async function GET(request: NextRequest, props: { params: Promise<{ userId: string }> }) {
  const params = await props.params
  const { userId } = params

  const currentUser = await auth()

  try {
    if (!currentUser) {
      return Response.json({ isFollowing: false }, { status: 200 })
    }

    const isFollowing = await prisma.follower.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUser?.user?.id,
          followingId: userId,
        },
      },
    })

    return Response.json({ isFollowing: Boolean(isFollowing) }, { status: 200 })
  } catch (error) {
    return Response.json(
      {
        status: 500,
        message: "Internal Server Error",
      },
      { status: 500 }
    )
  }
}
