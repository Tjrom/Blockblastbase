import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BlockBlast - Base Dev',
  description: 'Смарт-контракт для Base Dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
