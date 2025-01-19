"use server"

import { log } from "console"

import { PostStatus, Prisma } from "@prisma/client"
import dayjs from "dayjs"
import slugify from "slugify"

import prisma from "../prisma"
import { FilterValues, IActionReturn, PeriodValues } from "../shared/type"
import { postSelect, TCreatePostInput, TPostItem } from "./selects"
import { TGetPostsRequest, TGetPostsResponse } from "./type"

export const getPost = async ({
  postIdOrSlug,
}: {
  postIdOrSlug: string
}): Promise<IActionReturn<TPostItem>> => {
  try {
    const post = await prisma.post.findFirst({
      where: {
        OR: [
          {
            id: postIdOrSlug,
          },
          {
            slug: postIdOrSlug,
          },
        ],
      },
      select: postSelect,
    })

    if (!post) {
      throw {
        error: "NOT_FOUND",
      }
    }

    return {
      data: post,
    }
  } catch (error) {
    throw {
      error,
      data: null,
    }
  }
}

export const getPosts = async (searchParams: TGetPostsRequest): Promise<TGetPostsResponse> => {
  const searchTerm = searchParams?.search || ""
  const tag = searchParams?.tag || ""
  const filter = searchParams?.filter || FilterValues.LASTED // lasted or hot
  const period = searchParams?.period || PeriodValues.INFINITY // lasted or hot
  const limit = searchParams?.limit || 10
  const page = searchParams?.page || 1
  const authorId = searchParams?.authorId || ""

  let where: Prisma.PostWhereInput = {}

  if (searchParams?.postStatus) {
    where = {
      ...where,
      postStatus: PostStatus.PUBLISHED,
    }
  }

  let orderBy = {}

  if (authorId) {
    where = {
      ...where,
      authorId,
    }
  }

  if (filter === FilterValues.HOT) {
    if (period === PeriodValues.THIS_MONTH) {
      where = {
        ...where,
        updatedAt: {
          gte: dayjs().subtract(30, "day").toDate(),
        },
      }
    }

    if (period === PeriodValues.THIS_WEEK) {
      where = {
        ...where,
        updatedAt: {
          gte: dayjs().subtract(7, "day").toDate(),
        },
      }
    }

    orderBy = {
      ...orderBy,
      comments: {
        _count: "desc",
      },
    }
  }

  if (filter === FilterValues.LASTED) {
    orderBy = {
      ...orderBy,
      updatedAt: "desc",
    }
  }

  if (tag) {
    where = {
      ...where,
      tagOnPost: {
        some: {
          tag: {
            OR: [{ id: tag }, { slug: tag }],
          },
        },
      },
    }
  }

  if (searchTerm) {
    where = {
      ...where,
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    }
  }

  try {
    const [total, posts] = await prisma.$transaction([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        select: {
          ...postSelect,
        },
        take: Number(limit),
        skip: (Number(page) - 1) * Number(limit),
        orderBy,
      }),
    ])

    return {
      data: {
        total,
        data: posts,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    }
  } catch (error) {
    console.log(error)
    return {
      data: {
        data: [],
        total: 0,
        totalPages: 0,
        page: Number(page),
        limit: Number(limit),
      },
      error,
    }
  }
}

export const createPost = async (
  data: TCreatePostInput,
  userId: string
): Promise<IActionReturn<TPostItem>> => {
  let newPost: TPostItem
  try {
    const slug = slugify(data.title.toLocaleLowerCase()) + "-" + Date.now()

    newPost = await prisma.post.create({
      data: {
        slug: slug,
        title: data.title,
        content: data.content,
        authorId: userId,
        postStatus: PostStatus.PUBLISHED,
        tagOnPost: {
          // @ts-ignore
          create: data?.tags?.map((tag: any) => {
            if (!tag.__isNew__) {
              return {
                tag: {
                  connect: {
                    id: tag.value,
                  },
                },
              }
            }
            return {
              tag: {
                create: {
                  name: tag.label,
                  slug: tag.label.toLowerCase().replace(/\s/g, "-"),
                },
              },
            }
          }),
        },
      },
      select: postSelect,
    })

    return {
      data: newPost,
    }
  } catch (error) {
    throw {
      data: null,
      error: error,
    }
  }
}

export const updatePost = async (
  id: string,
  data: TCreatePostInput,
  userId: string
): Promise<IActionReturn<TPostItem>> => {
  try {
    // @ts-ignore
    const { tags, ...postData } = data

    const post = await prisma.post.update({
      where: {
        id,
        authorId: userId,
      },
      data: {
        ...postData,
        tagOnPost: {
          deleteMany: {},
          create: tags?.map((tag: any) => {
            if (!tag.__isNew__) {
              return {
                tag: {
                  connect: {
                    id: tag.value,
                  },
                },
              }
            }
            return {
              tag: {
                create: {
                  name: tag.label,
                  slug: tag.label.toLowerCase().replace(/\s/g, "-"),
                },
              },
            }
          }),
        },
      },
      select: postSelect,
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

export const updatePostStatus = async (
  id: string,
  postStatus: PostStatus,
  userId: string
): Promise<IActionReturn<TPostItem>> => {
  try {
    const post = await prisma.post.update({
      where: {
        id,
        authorId: userId,
      },
      data: {
        postStatus,
      },
      select: postSelect,
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

export const deletePost = async (id: string, userId: string): Promise<IActionReturn<TPostItem>> => {
  try {
    const post = await prisma.post.delete({
      where: {
        id,
        authorId: userId,
      },
      select: postSelect,
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
