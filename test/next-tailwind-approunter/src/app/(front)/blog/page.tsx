import { Metadata } from "next";
import BlogPage from "./blog";

export const metadata:Metadata = {
  title:'Blog',
  description:'Blog page',
  keywords:['Blog','Success Story'],
}

export default function Blog() {
  return (
    <BlogPage />
  )
}