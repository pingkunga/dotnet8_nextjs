"use client"

import React, { use } from 'react'
import { AppBar, Box, Button, Container, IconButton, Theme, Toolbar, styled, useMediaQuery } from '@mui/material'
import theme from '@/app/theme/Theme'
import Image from 'next/image'
import { MenuOutlined as MenuIcon } from '@mui/icons-material'
import Link from 'next/link'

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

  //Breakpoint
  //Desktop = true, Mobile = false
  const lgUp = useMediaQuery((theme:Theme) => theme.breakpoints.up('lg'))
  //Mobile = true, Desktop = false
  const lgDown = useMediaQuery((theme:Theme) => theme.breakpoints.down('lg'))

  //Button Styleing
  const ButtonStyled = styled(Button)(({theme}) => ({
    fontSize: '16px',
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
          {
            lgDown ? (
            <IconButton 
              edge="start"
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            ) : null
          }

          {
            lgUp ? (
              <>
                <ButtonStyled color='inherit' 
                              variant='text' 
                              href='/'
                              LinkComponent={Link}> Home </ButtonStyled>
                <ButtonStyled color='inherit' 
                              variant='text' 
                              href='/about'
                              LinkComponent={Link}> About </ButtonStyled>
                <ButtonStyled color='inherit' 
                              variant='text' 
                              href='/blog'
                              LinkComponent={Link}> Blog </ButtonStyled>
                <ButtonStyled color='inherit' 
                              variant='text' 
                              href='/contact'
                              LinkComponent={Link}> Contact </ButtonStyled>

                <Button color='primary'
                        variant='contained' 
                        href='/login'
                        LinkComponent={Link}> Login </Button>
              </>
            ) : null
          }
        </ToolbarStyled>
      </Container>
    </AppBarStyled>
  )
}