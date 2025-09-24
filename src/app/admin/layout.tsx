import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Admin Panel - Daily Words',
  description: 'Daily Words blog yonetim paneli',
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
