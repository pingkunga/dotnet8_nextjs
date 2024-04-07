"use client"

import React from 'react'
import { AppBar, Box, Container, IconButton, Toolbar, styled } from '@mui/material'
import theme from '@/app/theme/Theme'
import Image from 'next/image'
import { MenuOutlined as MenuIcon } from '@mui/icons-material'

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
          <Box flexGrow={1} />
          <IconButton 
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
        </ToolbarStyled>
      </Container>
    </AppBarStyled>
  )
}