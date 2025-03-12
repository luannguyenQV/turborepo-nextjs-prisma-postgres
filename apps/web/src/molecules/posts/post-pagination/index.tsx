"use client"

import React, { useCallback, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { getPosts, TPostItem } from "database"
import {
  cn,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "ui"

import PostItem from "../post-item"

export type TPostPaginationProps = {
  containerClassName?: string
  itemsPerPage?: number
}

export default function PostPagination({
  containerClassName,
  itemsPerPage = 10,
}: TPostPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get("page") || 1)

  const [isLoading, setIsLoading] = useState(false)
  const [posts, setPosts] = useState<TPostItem[]>([])
  const [totalPages, setTotalPages] = useState(1)

  // Fetch posts when the page changes
  React.useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true)
      try {
        const { data } = await getPosts({
          skip: (currentPage - 1) * itemsPerPage,
          take: itemsPerPage,
        })

        setPosts(data?.data || [])
        setTotalPages(data?.totalPages || 1)
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [currentPage, itemsPerPage])

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", page.toString())
      router.push(`?${params.toString()}`)
    },
    [router, searchParams]
  )

  // Generate pagination items
  const renderPaginationItems = useCallback(() => {
    const items = []
    const maxVisiblePages = 5

    // Always show first page
    items.push(
      <PaginationItem key="page-1">
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault()
            handlePageChange(1)
          }}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    )

    // Calculate range of visible pages
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3)

    // Adjust if we're near the end
    if (endPage <= startPage) {
      endPage = Math.min(totalPages - 1, startPage + 1)
    }

    // Show ellipsis if needed before middle pages
    if (startPage > 2) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(i)
            }}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    // Show ellipsis if needed after middle pages
    if (endPage < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(totalPages)
            }}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }, [currentPage, totalPages, handlePageChange])

  return (
    <div className={cn("space-y-6", containerClassName)}>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          {posts.length === 0 ? (
            <div className="flex justify-center py-8">
              <p className="text-muted-foreground">No posts found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostItem
                  key={post.id}
                  post={post}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) {
                        handlePageChange(currentPage - 1)
                      }
                    }}
                    className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) {
                        handlePageChange(currentPage + 1)
                      }
                    }}
                    className={cn(currentPage >= totalPages && "pointer-events-none opacity-50")}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  )
}
