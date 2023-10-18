import Link from "next/link";
import reactHtmlParser from "react-html-parser";
import { TPostItem } from "app/user/posts/post-actions";
import PostMeta from "@/molecules/user/posts/post-meta";

export type PostDetailProps = {
  post: TPostItem;
};

export default function PostDetail({ post }: PostDetailProps) {
  return (
    <div className="mb-8">
      <h1 className="flex-1 text-4xl font-extrabold text-slate-700">
        <Link href={`${post.id}`}>{post.title}</Link>
      </h1>

      <PostMeta post={post} />

      <div className="mt-12">{reactHtmlParser(post.content)}</div>
    </div>
  );
}