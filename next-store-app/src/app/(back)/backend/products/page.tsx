import React from 'react'
import ProductsPage from './Products'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Products Page',
  keywords: ['Products', 'Shop'],
}


export default function Products() {
  return (
    <ProductsPage />   
  )
}