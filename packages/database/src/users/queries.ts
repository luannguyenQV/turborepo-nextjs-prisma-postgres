"use server"

import { Prisma } from "@prisma/client"

import prisma from "../prisma"
import { IActionReturn } from "../shared/type"
import { TUserDetail, TUserItem, UserDetailSelect, UserSelect } from "./selects"

export const getUser = async (
  searchParams: Prisma.UserFindUniqueArgs
): Promise<IActionReturn<TUserDetail>> => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      ...searchParams,
      select: UserDetailSelect,
    })

    return {
      data: user,
    }
  } catch (error) {
    throw {
      error: "NOT_FOUND",
      data: null,
    }
  }
}

export const getUsers = async (
  searchParams: Prisma.UserFindManyArgs
): Promise<
  IActionReturn<{
    data: TUserItem[]
    total: number
    totalPages: number
    page: number
    limit: number
  }>
> => {
  try {
    const [total, users] = await prisma.$transaction([
      prisma.user.count({
        where: searchParams?.where,
      }),
      prisma.user.findMany({
        ...searchParams,
        select: UserSelect,
      }),
    ])

    return {
      data: {
        total,
        data: users,
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

export const createUser = async (
  data: Prisma.UserCreateInput
): Promise<IActionReturn<TUserDetail>> => {
  let newUser: TUserDetail

  console.log("createUser.data", data)
  try {
    newUser = await prisma.user.create({
      data,
      select: UserDetailSelect,
    })

    return {
      data: newUser,
    }
  } catch (error: any) {
    throw {
      data: null,
      error: error,
    }
  }
}

export const updateUser = async (
  id: string,
  data: Prisma.UserUpdateInput
): Promise<IActionReturn<TUserDetail>> => {
  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data,
      select: UserDetailSelect,
    })

    return {
      data: user,
    }
  } catch (error: any) {
    console.error("Error updating user:", error)
    throw {
      data: null,
      error: "Failed to update user",
    }
  }
}

export const deleteUser = async (id: string): Promise<IActionReturn<TUserDetail>> => {
  try {
    const user = await prisma.user.delete({
      where: {
        id,
      },
      select: UserDetailSelect,
    })

    return {
      data: user,
    }
  } catch (error) {
    throw {
      data: null,
      error: error,
    }
  }
}
