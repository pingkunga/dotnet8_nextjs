import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center min-h-screen justify-center">
      <div className="flex flex-col space-y-4 w-96 text-start">
        <h1 className='text-4xl'>404 NotFound</h1>
        <Link href="/home">&larr; Back to Home</Link>
      </div>
    </div>
  )
}