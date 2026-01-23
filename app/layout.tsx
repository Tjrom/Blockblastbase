import type { Metadata } from 'next'
import './globals.css'
import BaseVerification from './BaseVerification'

export const metadata: Metadata = {
  title: 'Block Blast - Retro Arcade Game',
  description: 'Retro arcade game in 80s style for Base Dev',
  other: {
    'base:app_id': '6971069c5f24b57cc50d333c',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content="6971069c5f24b57cc50d333c" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <BaseVerification />
        {children}
      </body>
    </html>
  )
}
