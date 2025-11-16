import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '15-Minute Dumbbell Workout',
  description: 'Full body workout routine with 5kg dumbbells',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
