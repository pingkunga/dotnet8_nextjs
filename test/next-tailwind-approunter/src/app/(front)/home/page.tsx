import { Metadata } from 'next'
import HomePage from './้home'

export const metadata:Metadata = {
  title:'Home',
  description:'Home page',
  keywords:['Home','Page'],
}

export default function Home() {
  return (
    <HomePage />
  )
}