import type { Metadata } from 'next'
import './globals.css'
import BaseVerification from './BaseVerification'

export const metadata: Metadata = {
  title: 'BlockBlast - Base Dev',
  description: 'Смарт-контракт для Base Dev',
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
    <html lang="ru">
      <body>
        <BaseVerification />
        {children}
      </body>
    </html>
  )
}
