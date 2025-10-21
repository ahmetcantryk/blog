import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Admin Panel - Woyable',
  description: 'Woyable blog yonetim paneli',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}




