"use client"



import { createTheme } from "@mui/material/styles"
import { Colors } from "./Colors"
// import { shadows } from "./Shadows"
// import typography from "./Typography"


//use internal next font
import { Roboto } from "next/font/google"

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
})

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: Colors.primary,
    //   light: Colors.primary,
    //   dark: Colors.primary,
    },
    secondary: {
      main: Colors.secondary,
    //   light: Colors.secondary,
    //   dark: Colors.secondary,
    },
  },

  typography: {
    fontFamily: roboto.style.fontFamily
  },
//   typography: typography,
//   shadows: shadows,
})

export default theme