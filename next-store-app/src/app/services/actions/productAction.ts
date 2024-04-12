"use server"

import { cookies } from 'next/headers'

// Variables for keeping the token
let accessToken: string | undefined

// Get Token from Cookies
function getToken() {
    if (accessToken) {
        return accessToken
    }
    
    // Get Token from Cookies
    const tokenCookie = cookies().get('accessToken')
    if (tokenCookie) {
        accessToken = tokenCookie.value
        return accessToken
    }
    
    return undefined
}

// ------------------------------
// CRUD Functions for Product
// ------------------------------

// Get All Products
async function getAllProducts() {
    getToken()
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/product`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      if (response.ok) {
          return response.json()
      } else {
         throw new Error('Failed to fetch products');
      }
    } catch (error) {
      console.error('An error occurred while fetching products:', error)
      throw new Error('Failed to fetch products');
    }
}

// Create Product
async function createProduct(payload: any) {
  getToken()
  try {

    console.log(payload)

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/product`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: payload,
    })
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      return { success: true }
    } else {
       throw new Error('Failed to create product')
    }
    
  } catch (error) {
    console.error('An error occurred while creating product:', error)
  }
}

export { getAllProducts, createProduct }