import "./global.css"
import ReduxProvider from "@/redux/provider"

export const metadata = {
  title: 'Power Management',
  description: 'Brings you closer to the future',
  icons: {
    icon: '/logo.png'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}
