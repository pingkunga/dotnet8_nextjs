import React from 'react'
import Header from '@/app/components/front/header/Header';

export default function FrontLayout({
        children,
      }: Readonly<{
        children: React.ReactNode;
      }>) {
  return (
    <html lang="en">
        <body>
            <Header />
            {children}
        </body>
    </html>
  )
}