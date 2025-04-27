"use server"

import { PostStatus, PostType, Prisma } from "@prisma/client"
import slugify from "slugify"

import prisma from "../prisma"
import { IActionReturn, IGetListResponse } from "../shared/type"
import { PostSelect, TPostItem } from "./selects"
import { PostCreateInputParams } from "./utils"

export const getPost = async (
  searchParams: Prisma.PostFindUniqueArgs
): Promise<IActionReturn<TPostItem>> => {
  try {
    const post = await prisma.post.findUniqueOrThrow({
      ...searchParams,
      select: PostSelect,
    })

    return {
      data: post,
    }
  } catch (error) {
    throw {
      error: "NOT_FOUND",
      data: null,
    }
  }
}

export const getPosts = async (
  searchParams: Prisma.PostFindManyArgs
): Promise<IGetListResponse<TPostItem>> => {
  try {
    const [total, posts] = await prisma.$transaction([
      prisma.post.count({
        where: searchParams?.where,
      }),
      prisma.post.findMany({
        ...searchParams,
        select: PostSelect,
      }),
    ])

    return {
      data: {
        total,
        data: posts,
        page: Number(searchParams?.skip),
        limit: Number(searchParams?.take),
        totalPages: Math.ceil(total / Number(searchParams?.take)),
      },
    }
  } catch (error) {
    return {
      data: {
        data: [],
        total: 0,
        totalPages: 0,
        page: Number(searchParams?.skip),
        limit: Number(searchParams?.take),
      },
      error,
    }
  }
}

export const createPost = async ({
  title,
  content,
  authorId,
  categoryId,
  tagIds = [],
  newTags = [],
  mediaId,
  postType = PostType.TOPIC,
  postStatus = PostStatus.DRAFT,
  isPinned = false,
  isLocked = false,
  version = 1,
}: PostCreateInputParams): Promise<IActionReturn<TPostItem>> => {
  let newPost: TPostItem

  const slug = `${slugify(title, { lower: true })}-${Date.now()}`

  try {
    const postInput: Prisma.PostCreateInput = {
      title,
      content,
      slug,
      postStatus,
      postType,
      isPinned,
      isLocked,
      version,
      author: {
        connect: { id: authorId },
      },
    }

    // Connect to existing category if provided
    if (categoryId) {
      postInput.category = {
        connect: { id: categoryId },
      }
    }

    // Connect to existing media if provided
    if (mediaId) {
      postInput.media = {
        connect: { id: mediaId },
      }
    }

    // Handle existing tags
    if (tagIds.length > 0) {
      postInput.tagOnPost = {
        create: tagIds.map((tagId) => ({
          tag: {
            connect: { id: tagId },
          },
        })),
      }
    }

    // Handle new tags
    if (newTags.length > 0) {
      postInput.tags = {
        create: newTags.map((tag) => ({
          name: tag.name,
          slug: slugify(tag.name, { lower: true }),
          type: tag.type,
          creator: {
            connect: { id: authorId },
          },
        })),
      }
    }

    // Create initial post history entry
    if (content) {
      postInput.history = {
        create: {
          title,
          content,
          editor: {
            connect: { id: authorId },
          },
        },
      }
    }

    // Create the post with the transformed input
    newPost = await prisma.post.create({
      data: postInput,
      select: PostSelect,
    })

    return {
      data: newPost,
    }
  } catch (error: any) {
    throw {
      data: null,
      error: error,
    }
  }
}

export const updatePost = async (
  id: string,
  data: Prisma.PostUpdateInput,
  userId: string
): Promise<IActionReturn<TPostItem>> => {
  try {
    // If title is being updated, update the slug as well
    if (data.title && typeof data.title === "string") {
      data.slug = slugify(data.title, { lower: true }) + "-" + Date.now()
    }

    // Only author can update the post so id, authorId is required
    const post = await prisma.post.update({
      where: {
        id,
        authorId: userId,
      },
      data,
      select: PostSelect,
    })

    return {
      data: post,
    }
  } catch (error: any) {
    console.error("Error updating post:", error)
    throw {
      data: null,
      error: "Failed to update post",
    }
  }
}

export const deletePost = async (id: string, userId: string): Promise<IActionReturn<TPostItem>> => {
  try {
    const post = await prisma.post.delete({
      where: {
        id,
        authorId: userId,
      },
      select: PostSelect,
    })

    return {
      data: post,
    }
  } catch (error) {
    throw {
      data: null,
      error: error,
    }
  }
}

/**
 * Find a post by either slug or ID
 * @param slugOrId The post slug or ID
 * @returns The post data or throws an error if not found
 */
export const findPostBySlugOrId = async (slugOrId: string): Promise<IActionReturn<TPostItem>> => {
  try {
    // Try to find by slug first
    try {
      return await getPost({
        where: { slug: slugOrId },
      })
    } catch (error) {
      // If not found by slug, try by ID
      return await getPost({
        where: { id: slugOrId },
      })
    }
  } catch (error) {
    throw {
      error: "NOT_FOUND",
      data: null,
    }
  }
}
