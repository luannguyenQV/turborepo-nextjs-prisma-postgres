import { Metadata } from "next"
import { notFound } from "next/navigation"

import PostDetail from "@/molecules/posts/post-detail"
import Comments from "@/molecules/posts/post-detail/comments"
import LikeButton from "@/molecules/posts/post-detail/like-button"
import TableOfContents from "@/molecules/posts/post-detail/table-of-contents"
import BookmarkButton from "@/molecules/posts/post-item/bookmark-button"

import "./tocbot.css"

import { findPostBySlugOrId, PostStatus } from "database"

import { auth } from "@/configs/auth"
import { TSearchParams } from "@/types"

export async function generateMetadata(props): Promise<Metadata> {
  const params = await props.params
  const post = await findPostBySlugOrId(params?.postId)

  return {
    title: post?.data?.title,
    description: "", //post?.content.slice(0, 160),
  }
}

export default async function Page(props: {
  params: Promise<{ postId: string }>
  searchParams: Promise<TSearchParams>
}) {
  const searchParams = await props.searchParams
  const params = await props.params
  const post = await findPostBySlugOrId(params?.postId)
  const session = await auth()

  if (
    !post ||
    (post.data?.postStatus === PostStatus.DRAFT && session?.user?.id !== post?.data?.author?.id)
  ) {
    return notFound()
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-9 flex gap-4">
        <div className="mt-20 flex w-12 flex-col gap-6">
          <LikeButton post={post.data} />
          <BookmarkButton
            showCount
            post={post.data}
          />
        </div>

        <div className="flex-1">
          <PostDetail post={post.data} />
          <Comments
            post={post.data}
            searchParams={searchParams}
          />
        </div>
      </div>

      <div className="col-span-3">
        <TableOfContents />
      </div>
    </div>
  )
}
