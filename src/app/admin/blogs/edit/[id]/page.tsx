"use client";
import BlogEditor from "../../components/BlogEditor";
import { use } from "react";

export default function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <BlogEditor postId={id} />;
}
