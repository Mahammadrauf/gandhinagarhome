import type { Metadata } from 'next'
import './globals.css'
import WhatsAppChat from '@/components/WhatsAppChat'

export const metadata: Metadata = {
  title: 'GandhinagarHomes - Premium Real Estate in Gandhinagar',
  description: 'Premium homes and a trusted selling experience — curated for Gandhinagar.',
  icons: {
    icon: '/images/icon.jpeg',
    shortcut: '/images/icon.jpeg',
    apple: '/images/icon.jpeg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <WhatsAppChat />
      </body>
    </html>
  )
}

