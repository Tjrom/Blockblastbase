import type { Metadata } from 'next'
import './globals.css'
import BaseVerification from './BaseVerification'

const ROOT_URL = process.env.NEXT_PUBLIC_URL || 'https://blockblastbase.vercel.app'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Block Blast - Puzzle Game on Base',
    description: 'Block Blast puzzle game with on-chain leaderboard on Base Sepolia',
    openGraph: {
      title: 'Block Blast - Puzzle Game on Base',
      description: 'Block Blast puzzle game with on-chain leaderboard on Base Sepolia',
      images: [`${ROOT_URL}/embed.png`],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Block Blast - Puzzle Game on Base',
      description: 'Block Blast puzzle game with on-chain leaderboard on Base Sepolia',
      images: [`${ROOT_URL}/embed.png`],
    },
    other: {
      'base:app_id': '6971069c5f24b57cc50d333c',
      'fc:miniapp': JSON.stringify({
        version: 'next',
        imageUrl: `${ROOT_URL}/embed.png`,
        button: {
          title: 'Play Block Blast',
          action: {
            type: 'launch_frame',
            name: 'Block Blast',
            url: ROOT_URL,
            splashImageUrl: `${ROOT_URL}/splash.png`,
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
