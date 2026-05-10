import './globals.css'
export const metadata = { title: 'Dluxe — Project Dashboard', description: 'Project transparency dashboard' }
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet"/>
      </head>
      <body>{children}</body>
    </html>
  )
}
