import type { Metadata } from 'next'
import './globals.css'
import WhatsAppChat from '@/components/WhatsAppChat'
import { ToastProvider } from '@/components/ui/Toast'

export const metadata: Metadata = {
  title: 'GandhinagarHomes - Premium Real Estate in Gandhinagar',
  description: 'Premium homes and a trusted selling experience — curated for Gandhinagar.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/images/icons.jpeg',
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
        <ToastProvider>
          {children}
          <WhatsAppChat />
        </ToastProvider>
      </body>
    </html>
  )
}

