import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/reset.css';
import '@/styles/utils.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AROTEC PANEL',
  description: 'Painel adminstrativo da AROTEC', 
}

interface RootLayoutProps{
  children: React.ReactNode
}
export default function RootLayout({ children } : RootLayoutProps) {
  return (
    <html lang="pt">
      <body className={inter.className}>{children}</body>
    </html>
  )

}
