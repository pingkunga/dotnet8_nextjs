"use client"

import React from 'react'
import { AppBar, Container, Toolbar, styled } from '@mui/material'
import theme from '@/app/theme/Theme'

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
          <h1>Header</h1>
        </ToolbarStyled>
      </Container>
    </AppBarStyled>
  )
}