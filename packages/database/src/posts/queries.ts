"use server"

import { Prisma } from "@prisma/client"
import slugify from "slugify"

import prisma from "../prisma"
import { IActionReturn, IGetListResponse } from "../shared/type"
import { PostSelect, TPostItem } from "./selects"

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

export const createPost = async (data: Prisma.PostCreateInput): Promise<IActionReturn<TPostItem>> => {
  let newPost: TPostItem
  try {
    newPost = await prisma.post.create({
      data,
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
