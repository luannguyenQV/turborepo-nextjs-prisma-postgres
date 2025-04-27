import { NextRequest } from "next/server"

import prisma, { findPostBySlugOrId } from "database"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ postIdOrSlug: string }> }
) {
  const params = await props.params
  try {
    const result = await findPostBySlugOrId(params.postIdOrSlug)

    if (!result || !result.data) {
      return Response.json({
        status: 404,
        message: "Post not found",
      })
    }

    return Response.json(result.data, { status: 200 })
  } catch (error) {
    return Response.error()
  }
}
