import { Post, PostStatus } from "@prisma/client"

import { FilterValues, PeriodValues } from "../shared/type"
import { TPostItem } from "./selects"

export type TGetPostsRequest = {
  search?: string
  tag?: string
  filter?: FilterValues
  period?: PeriodValues
  limit?: number
  page?: number
  authorId?: string
  postStatus?: PostStatus
}

export type TGetPostsResponse = {
  data: {
    data: TPostItem[]
    total: number
    totalPages: number
    page: number
    limit: number
  }
  error?: unknown
}

export type TTagInput = {
  value?: string
  label: string
  __isNew__?: boolean
}

export type TCreatePostInput = {
  title: string
  content: string
  tags?: TTagInput[]
}
