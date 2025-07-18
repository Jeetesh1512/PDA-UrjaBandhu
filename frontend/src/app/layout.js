import "./global.css"

export const metadata = {
  title: 'Power Management',
  description: 'Brings you closer to the future',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
