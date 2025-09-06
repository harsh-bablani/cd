import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Clinic Front Desk System',
  description: 'A modern clinic front desk management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
