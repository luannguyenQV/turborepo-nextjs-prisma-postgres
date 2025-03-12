import { Suspense } from "react"
import { Metadata } from "next"

import { Typography } from "ui"

import PostPagination from "@/molecules/posts/post-pagination"

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to our community forum",
}

export default function HomePage() {
  return (
    <div className="container py-6">
      <Suspense fallback={<div className="py-8 text-center">Loading posts...</div>}>
        <PostPagination />
      </Suspense>
    </div>
  )
}
