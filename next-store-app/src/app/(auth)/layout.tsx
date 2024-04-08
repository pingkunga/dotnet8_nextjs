import React from 'react'
import Header from '@/app/components/front/header/Header';
import Footer from '@/app/components/front/footer/Footer';

export default function AuthLayout({
        children,
      }: Readonly<{
        children: React.ReactNode;
      }>) {
  return (
    <html lang="en">
        <body>
            <Header />
            {children}
            <Footer />
        </body>
    </html>
  )
}