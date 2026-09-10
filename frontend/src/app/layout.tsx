import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { AppProviders } from '@/providers/app-providers'
import './globals.css'
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Koda · Devteam Ops Assessment',
  description: 'Next.js frontend for the Koda Devteam Ops Assessment Laravel API.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
