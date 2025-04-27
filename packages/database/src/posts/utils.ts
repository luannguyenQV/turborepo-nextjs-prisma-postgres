import { PostStatus, PostType, TagType } from "@prisma/client"

export type PostCreateInputParams = {
  title: string
  content?: string
  authorId: string
  categoryId?: string
  tagIds?: string[]
  newTags?: Array<{
    name: string
    type: TagType
  }>
  mediaId?: string
  postType?: PostType
  postStatus?: PostStatus
  isPinned?: boolean
  isLocked?: boolean
  slug?: string
  version?: number
}
