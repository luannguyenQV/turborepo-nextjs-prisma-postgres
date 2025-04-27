import { createImage, deleteImage, getImage, getImages, updateImage } from "./images/queries"
import { TImage } from "./images/selects"
import { IImageFilter, IListImageResponse, ImageOrderBys } from "./images/type"
import {
  createPost,
  deletePost,
  findPostBySlugOrId,
  getPost,
  getPosts,
  updatePost,
} from "./posts/queries"
import { TPostItem } from "./posts/selects"
import { PostCreateInputParams } from "./posts/utils"
import prisma from "./prisma"
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  FilterValues,
  IActionReturn,
  IGetListResponse,
  PeriodValues,
} from "./shared/type"
import { createTag, getTag, getTags } from "./tags/queries"
import type { TTagItem, TTagListItem } from "./tags/selects"
import { tagListSelect } from "./tags/selects"
import { createUser, deleteUser, getUser, updateUser } from "./users/queries"
import { TUserDetail } from "./users/selects"

export * from "@prisma/client"
export default prisma

export {
  // Tags
  createTag,
  getTag,
  getTags,
  tagListSelect,

  // Posts
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  findPostBySlugOrId,
  FilterValues,
  PeriodValues,

  // Users
  getUser,
  createUser,
  updateUser,

  // Images
  getImages,
  createImage,
  updateImage,
  deleteImage,
  getImage,
}

export type {
  //Tags
  TTagItem,
  TTagListItem,

  // Posts
  TPostItem,
  PostCreateInputParams,

  // Images
  IImageFilter,
  IListImageResponse,
  ImageOrderBys,
  TImage,

  // Users
  TUserDetail,

  // Shared
  IActionReturn,
  IGetListResponse,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
}
