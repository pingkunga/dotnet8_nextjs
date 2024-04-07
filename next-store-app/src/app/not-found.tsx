import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

export const metadata:Metadata = {
    title: "404 - Page Not Found",
    description: "404 - Page Not Found",
    keywords: "404 - Page Not Found",
}

export default function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <Link href="/home">&larr; Go back to home</Link>
    </div>
  )
}