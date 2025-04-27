"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import prisma, {
  createPost,
  PostCreateInputParams,
  PostOnUserType,
  PostStatus,
  Prisma,
  TPostItem,
  updatePost,
} from "database"
import { toast } from "react-toastify"
import * as z from "zod"

import { auth } from "@/configs/auth"
import APP_ROUTES from "@/constants/routes"
import { ActionState } from "@/libs/validationAction"
import { TUserItem, userSelect } from "@/types/users"

export const getTotalActions = async ({
  postId,
  actionType,
}: {
  postId: string
  actionType: PostOnUserType
}) => {
  const session = await auth()

  try {
    const promises = []

    promises.push(
      prisma.postOnUser.count({
        where: {
          postId,
          type: actionType,
        },
      })
    )

    if (session?.user?.id) {
      promises.push(
        prisma.postOnUser.findFirst({
          where: {
            postId,
            userId: session?.user?.id,
            type: actionType,
          },
        })
      )
    }

    const [total, haveAction] = await Promise.all(promises)

    return { total, haveAction }
  } catch (error) {
    throw error
  }
}

export const addRelation = async ({
  postId,
  postSlug,
  action,
}: {
  postId: string
  postSlug: string
  action: PostOnUserType
}) => {
  const session = await auth()
  const postField = action === PostOnUserType.LIKE ? "totalLike" : "totalFollow"
  try {
    await prisma.$transaction([
      prisma.postOnUser.upsert({
        where: {
          userId_postId_type: {
            postId: postId,
            userId: session?.user?.id,
            type: action,
          },
        },
        update: {
          postId: postId,
          userId: session?.user?.id,
          type: action,
        },
        create: {
          postId: postId,
          userId: session?.user?.id,
          type: action,
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: {
          [postField]: {
            increment: 1,
          },
        },
      }),
    ])

    revalidatePath(`/post/${postSlug}`)
  } catch (error) {
    throw error
  }
}

export const removeRelation = async ({
  postId,
  postSlug,
  action,
}: {
  postId: string
  postSlug: string
  action: PostOnUserType
}) => {
  const session = await auth()
  const postField = action === PostOnUserType.LIKE ? "totalLike" : "totalFollow"

  try {
    await prisma.$transaction([
      prisma.postOnUser.delete({
        where: {
          userId_postId_type: {
            postId: postId,
            userId: session?.user?.id,
            type: action,
          },
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: {
          [postField]: {
            decrement: 1,
          },
        },
      }),
    ])
  } catch (error) {
    throw error
  }
}

export const getLikers = async ({ postId }: { postId: string }) => {
  try {
    const likers = (await prisma.user.findMany({
      where: {
        postOnUsers: {
          some: {
            postId,
            type: PostOnUserType.LIKE,
          },
        },
      },
      select: userSelect,
    })) as unknown as TUserItem[]

    return {
      data: likers,
      errorMessage: "",
    }
  } catch (error) {
    return { data: [], errorMessage: "Error fetching likers" }
  }
}

export async function onTogglePost(
  prevState: { post: TPostItem },
  _
): Promise<{ post: TPostItem }> {
  try {
    // Implementation for post toggle status
    if (!prevState.post?.id || !prevState.post?.author?.id) {
      throw "Invalid post data"
    }

    const result = await updatePost(
      prevState.post.id,
      {
        postStatus:
          prevState.post.postStatus === PostStatus.DRAFT ? PostStatus.PUBLISHED : PostStatus.DRAFT,
      },
      prevState.post.author.id
    )

    return { post: result.data }
  } catch (error) {
    toast.error(error)
    return { post: prevState.post }
  } finally {
    revalidatePath(`/post/${prevState.post.slug}`)
  }
}

export const handleCreateUpdatePost = async ({
  postId,
  data,
  userId,
}: {
  postId: string
  data: PostCreateInputParams
  userId: string
}) => {
  let newPostId = postId
  try {
    if (postId) {
      // For updates, transform the data to PostUpdateInput manually
      const updateData = {
        title: data.title,
        content: data.content,
        isPinned: data.isPinned,
        isLocked: data.isLocked,
        postStatus: data.postStatus,
        postType: data.postType,
      } as Prisma.PostUpdateInput

      // Handle category connection if provided
      if (data.categoryId) {
        updateData.category = {
          connect: { id: data.categoryId },
        }
      }

      // Handle media connection if provided
      if (data.mediaId) {
        updateData.media = {
          connect: { id: data.mediaId },
        }
      }

      await updatePost(postId, updateData, userId)
    } else {
      // For creation, directly use createPost with our params
      // It will handle the transformation internally
      const post = await createPost({
        ...data,
        authorId: userId,
      })
      newPostId = post?.data?.slug
    }
  } catch (error) {
    toast.error(error)
  } finally {
    revalidatePath(APP_ROUTES.POST.replace(":postId", newPostId))
    redirect(APP_ROUTES.POST.replace(":postId", newPostId))
  }
}

const toggleLikePostSchema = z.object({
  postId: z.string(),
  postSlug: z.string(),
  isLiked: z.boolean(),
})

export type ToggleLikePostSchemaType = ActionState & z.infer<typeof toggleLikePostSchema>

export const onToggleLikePostWithUser = async (
  data: ToggleLikePostSchemaType,
  formData: FormData
) => {
  try {
    await (data.isLiked ? removeRelation : addRelation)({
      postId: data.postId,
      postSlug: data.postSlug,
      action: PostOnUserType.LIKE,
    })
    return {
      postId: data.postId,
      postSlug: data.postSlug,
      isLiked: !data.isLiked,
      success: "Success",
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" }
  } finally {
    revalidatePath(`/post/${data.postSlug}`)
  }
}

export const handleBookmark = async (prevState: ActionState, _: FormData) => {
  try {
    await (prevState.isBookmarked ? removeRelation : addRelation)({
      postId: prevState.postId,
      postSlug: prevState.postSlug,
      action: PostOnUserType.BOOKMARK,
    })
    return {
      postId: prevState.postId,
      postSlug: prevState.postSlug,
      isBookmarked: !prevState.isBookmarked,
      success: "Success",
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" }
  } finally {
    revalidatePath(`/post/${prevState.postSlug}`)
  }
}
