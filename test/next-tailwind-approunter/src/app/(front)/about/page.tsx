import React from 'react'
import AboutPage from './about'
import { Metadata } from 'next'


export const metadata:Metadata = {
  title:'About',
  description:'About page',
  keywords:['About','Company Profile'],
}

export default function page() {
  return (
    <AboutPage />
  )
}