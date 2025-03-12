"use client"

import React, { useCallback, useState } from "react"
import { useParams } from "next/navigation"

import { getPosts, TPostItem } from "database"
import { cn } from "ui"

import InfiniteScroll from "@/molecules/infinite-scroll"

import PostItem from "../post-item"

export type TPostListProps = {
  getPostParams?: TGetPostsRequest
  containerClassName?: string
}

export default function PostList({ getPostParams = {}, containerClassName }: TPostListProps) {
  const searchParams = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [posts, setPosts] = useState<TPostItem[]>([])
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(true)

  const loadPosts = useCallback(async () => {
    if (!hasNextPage) return

    setIsLoading(true)
    const { data } = await getPosts({
      ...getPostParams,
      ...searchParams,
      page: page.toString(),
    })

    setPosts((prev) => [...prev, ...data?.data])
    setHasNextPage(data?.totalPages > page)
    setIsLoading(false)
    setPage((prev) => prev + 1)
  }, [searchParams, page])

  return (
    <div className={cn("mt-4", containerClassName)}>
      <InfiniteScroll
        loading={isLoading}
        nextPage={loadPosts}
      >
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
          />
        ))}
      </InfiniteScroll>
    </div>
  )
}
