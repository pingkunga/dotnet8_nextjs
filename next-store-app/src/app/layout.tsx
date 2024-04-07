import type { Metadata } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";    //theme.ts

export const metadata: Metadata = {
  title: {
    template: "%s | Ping Store",
    default: "Home | Ping Store",
  }, 
  description: "Ping Store - E-commerce store for learning purposes nextjs + dotnet8 + material-ui",
  keywords: "ping store, e-commerce, nextjs, dotnet8, material-ui",
  authors: [{name: "Chatri Ngambenchawong"}],

  // Favicon
  icons: "@/favicon.ico",
  //Robot
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          {/* Add your theme xxx here */}
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
