import type { Metadata } from 'next'
import './globals.css'
import BaseVerification from './BaseVerification'

const ROOT_URL = process.env.NEXT_PUBLIC_URL || 'https://blockblastbase.vercel.app'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Block Blast - Puzzle Game on Base',
    description: 'Block Blast puzzle game with on-chain leaderboard on Base Sepolia',
    other: {
      'base:app_id': '6971069c5f24b57cc50d333c',
      'fc:miniapp': JSON.stringify({
        version: 'next',
        button: {
          title: 'Play Block Blast',
          action: {
            type: 'launch_miniapp',
            name: 'Block Blast',
            url: ROOT_URL,
            splashBackgroundColor: '#0a0e27',
          },
        },
      }),
    },
  }
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
      </head>
      <body>
        <BaseVerification />
        {children}
      </body>
    </html>
  )
}
