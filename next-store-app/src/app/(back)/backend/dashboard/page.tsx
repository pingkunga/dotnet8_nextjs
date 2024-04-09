import React from 'react'
import DashboardPage from './Dashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard Page',
  keywords: ['Dashboard', 'Shop'],
}


export default function Dashboard() {
  return (
    <DashboardPage />
  )
}