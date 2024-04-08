'use client'
import React from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import AuthRegister from '@/app/(auth)/_authForms/AuthRegister'
import Image from "next/image";
import Link from 'next/link';

type Props = {}

export default function RegisterPage({}: Props) {
    return (
        <Grid container spacing={0} justifyContent="center" sx={{ overflowX: "hidden" }}>
            <Grid
              item
              xs={12}
              sm={12}
              lg={7}
              xl={8}
              sx={{
                position: "relative",
                "&:before": {
                  content: '""',
                  background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
                  backgroundSize: "400% 400%",
                  animation: "gradient 15s ease infinite",
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  opacity: "0.3",
                },
              }}
            >
              <Box position="relative">
                {/* <Box px={3}>
                  <Logo />
                </Box> */}
                <Box
                  alignItems="center"
                  justifyContent="center"
                  height={"calc(100vh - 75px)"}
                  sx={{
                    display: {
                      xs: "none",
                      lg: "flex",
                    },
                  }}
                >
                  <Image
                    src={"/images/front/background/login-bg.svg"}
                    alt="bg" width={500} height={500}
                    style={{
                      width: "100%",
                      maxWidth: "500px",  maxHeight: '500px',
                    }}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              lg={5}
              xl={4}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Box p={4}>
                <AuthRegister
                  title="Welcome to Modernize"
                  subtext={
                    <Typography variant="subtitle1" color="textSecondary" mb={1}>
                      Your Admin Dashboard
                    </Typography>
                  }
                  subtitle={
                    <Stack direction="row" spacing={1} mt={3}>
                      <Typography color="textSecondary" variant="h6" fontWeight="400">
                        Already have an Account?
                      </Typography>
                      <Typography
                        component={Link}
                        href="/login"
                        fontWeight="500"
                        sx={{
                          textDecoration: "none",
                          color: "primary.main",
                        }}
                      >
                        Sign In
                      </Typography>
                    </Stack>
                  }
                />
              </Box>
            </Grid>
        </Grid>
    )
}