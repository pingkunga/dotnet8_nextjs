import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

//https://nextjs.org/docs/app/api-reference/functions/generate-metadata#template
export const metadata: Metadata = {
  title: {
    template: "%s | PingkungA Site",
    default: "Chatri | PingkungA Site",
  },
  description: "PingkungA Site is a website for Learning Next.js",
  keywords: ["Next.js", "TypeScript", "Tailwind CSS", "Jest", "React Testing Library"],
  authors: [ {name: "Chatri", url: "https://naiwaen.debuggingsoft.com/"}],

  //favicon
  icons: "/favicon.ico",

  robots: "index, follow",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <nav>header root</nav> */}
        {children}
        {/* <nav>footer root</nav> */}
      </body>
    </html>
  );
}
