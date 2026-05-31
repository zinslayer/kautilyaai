import type { Metadata, Viewport } from 'next'
import dynamic from 'next/dynamic'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { DeviceEffects } from '@/components/DeviceEffects'
import { ScrollReveal } from '@/components/ScrollReveal'
import './globals.css'
import './layout.css'

const EnterpriseAccessModalClient = dynamic(
    () => import('@/components/EnterpriseAccessModalClient'),
    { ssr: false, loading: () => null },
)

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'KautilyaAI - Trade Intelligence Platform',
    description: 'AI-powered trade data analysis and market intelligence',
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
                <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
            </head>
            <body className="min-h-screen font-sans antialiased">
                <DeviceEffects />
                <ScrollReveal />
                {children}
                <EnterpriseAccessModalClient />
            </body>
        </html>
    )
}
