import './globals.scss'
import { Inter } from 'next/font/google'
import {Providers} from "@/components/Providers";
import Script from "next/script";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'aeum',
  description: 'Aeum Road',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
