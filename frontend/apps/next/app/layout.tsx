import 'raf/polyfill'
import 'setimmediate'
import '../global.css'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Money Monkey',
  description: 'Simple expense tracking',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-full flex-grow bg-white pb-16 text-black">
          {children}
        </main>
      </body>
    </html>
  )
}
