import React from 'react'
import HomePage from './Home'
import { Metadata } from 'next'

type Props = {}

export const metadata: Metadata = {
    title: 'Home',
    description: 'Home page',
    keywords: ['home', 'page'],
}

export default function Home({}: Props) {
  return (
    <HomePage />
  )
}