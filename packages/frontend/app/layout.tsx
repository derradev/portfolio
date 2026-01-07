import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import AnalyticsProvider from '@/components/AnalyticsProvider'
import Footer from '@/components/Footer'
import MaintenanceWrapper from '@/components/MaintenanceWrapper'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

export const metadata: Metadata = {
  title: 'William Malone - IT Support Engineer | Aspiring Cybersecurity Professional',
  description: 'Professional portfolio of William Malone, IT Support Engineer with expertise in Active Directory, system administration, and pursuing a career in cybersecurity.',
  keywords: 'IT support, cybersecurity, system administrator, Active Directory, network security, Python, IT infrastructure',
  authors: [{ name: 'William Malone' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'William Malone - IT Support Engineer | Aspiring Cybersecurity Professional',
    description: 'Professional portfolio showcasing IT infrastructure expertise and cybersecurity journey.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} min-h-screen`}>
        <MaintenanceWrapper>
          <AnalyticsProvider>
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </AnalyticsProvider>
        </MaintenanceWrapper>
      </body>
    </html>
  )
}
