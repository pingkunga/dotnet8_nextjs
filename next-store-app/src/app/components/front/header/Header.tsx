"use client"

import React from 'react'
import { AppBar, Container, Toolbar, styled } from '@mui/material'
import theme from '@/app/theme/Theme'
import Image from 'next/image'

export default function Header() {
  const AppBarStyled = styled(AppBar)(({theme}) => ({
    backgroundColor: theme.palette.background.default,
    justifyContent: 'center',

    //ปรับ size ของ header ให้เล็กลง ตาม จอ
    [theme.breakpoints.up('lg')]: {
        minHeight: '80px',

    },
  }))

  // Toolbar Styleing
  const ToolbarStyled = styled(Toolbar)(({theme}) => ({
    width: '100%',
    paddingLeft: '0 !important',
    paddingRight: '0 !important',
    color: theme.palette.text.secondary,
  }))

  return (
    <AppBarStyled position="sticky" elevation={5}>
      <Container maxWidth="lg">
        <ToolbarStyled>
          <Image 
            src={"/images/logos/dark-logo.svg"} 
            alt="logo" 
            width={170}
            height={50}
            priority
          />
        </ToolbarStyled>
      </Container>
    </AppBarStyled>
  )
}