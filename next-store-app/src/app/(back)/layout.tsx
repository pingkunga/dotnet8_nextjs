'use client'
import React from 'react'
import { Box, Container, styled, useMediaQuery } from "@mui/material"
import Sidebar from "@/app/components/back/sidebar/Sidebar"
import Header from '@/app/components/back/header/Header'


//CSS with JS
const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}))

//CSS with JS
const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  width: "100%",
  backgroundColor: "transparent",
}))

interface Props {
  children: React.ReactNode;
}

export default function BackLayout({
    children,
  }: Readonly<{
    children: React.ReactNode
  }>) {

  //Hide Mene
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'))
  const hideMenu: any = lgUp ? true : false

  return (
    <MainWrapper>
        {
          hideMenu ? <Sidebar /> : null
        }

        <PageWrapper>
            <Header />
            <Container
                sx={{
                    maxWidth: "100%!important",
                }}
            >
                  {/* Page Content */}
                  <Box sx={{ minHeight: "calc(100vh - 170px)" }}>
                    {children}
                  </Box>
            </Container>
        </PageWrapper>
    </MainWrapper>
  )
}