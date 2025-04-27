import { Metadata } from "next"

import { findPostBySlugOrId } from "database"

import PostForm from "@/molecules/post-form"

export async function generateMetadata(props): Promise<Metadata> {
  const params = await props.params
  const post = await findPostBySlugOrId(params?.postId)

  return {
    title: post?.data?.title,
    description: "", // post?.content.slice(0, 160),
  }
}

export default async function Page(props: { params: Promise<{ postId: string }> }) {
  const params = await props.params
  const post = await findPostBySlugOrId(params?.postId)

  return <PostForm post={post?.data} />
}
