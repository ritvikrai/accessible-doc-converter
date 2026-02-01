import './globals.css'
export const metadata = { title: 'Accessible Docs', description: 'Make documents accessible to everyone' }
export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>
}
