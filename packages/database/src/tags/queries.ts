"use server"

import { Prisma } from "@prisma/client"
import slugify from "slugify"

import prisma from "../prisma"
import { IActionReturn } from "../shared/type"
import { TagListSelect, TagSelect, TTagItem, TTagListItem } from "./selects"

export const getTag = async (
  searchParams: Prisma.TagFindUniqueArgs
): Promise<IActionReturn<TTagItem>> => {
  try {
    const tag = await prisma.tag.findUniqueOrThrow({
      ...searchParams,
      select: TagSelect,
    })

    return {
      data: tag,
    }
  } catch (error) {
    throw {
      error: "NOT_FOUND",
      data: null,
    }
  }
}

export const getTags = async (
  searchParams: Prisma.TagFindManyArgs
): Promise<
  IActionReturn<{
    data: TTagListItem[]
    total: number
    totalPages: number
    page: number
    limit: number
  }>
> => {
  try {
    const [total, tags] = await prisma.$transaction([
      prisma.tag.count({
        where: searchParams?.where,
      }),
      prisma.tag.findMany({
        ...searchParams,
        select: TagListSelect,
      }),
    ])

    return {
      data: {
        total,
        data: tags,
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

export const createTag = async (data: Prisma.TagCreateInput): Promise<IActionReturn<TTagItem>> => {
  let newTag: TTagItem
  try {
    // Generate slug if not provided
    if (!data.slug && data.name) {
      data.slug = slugify(data.name.toLowerCase()) + "-" + Date.now()
    }

    newTag = await prisma.tag.create({
      data,
      select: TagSelect,
    })

    return {
      data: newTag,
    }
  } catch (error: any) {
    throw {
      data: null,
      error: error,
    }
  }
}

export const updateTag = async (
  id: string,
  data: Prisma.TagUpdateInput
): Promise<IActionReturn<TTagItem>> => {
  try {
    // If name is being updated, update the slug as well
    if (data.name && typeof data.name === "string") {
      data.slug = slugify(data.name.toLowerCase()) + "-" + Date.now()
    }

    const tag = await prisma.tag.update({
      where: {
        id,
      },
      data,
      select: TagSelect,
    })

    return {
      data: tag,
    }
  } catch (error: any) {
    console.error("Error updating tag:", error)
    throw {
      data: null,
      error: "Failed to update tag",
    }
  }
}

export const deleteTag = async (id: string): Promise<IActionReturn<TTagItem>> => {
  try {
    const tag = await prisma.tag.delete({
      where: {
        id,
      },
      select: TagSelect,
    })

    return {
      data: tag,
    }
  } catch (error) {
    throw {
      data: null,
      error: error,
    }
  }
}
