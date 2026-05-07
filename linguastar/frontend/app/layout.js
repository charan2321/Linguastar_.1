import "./globals.css";
import Script from "next/script";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Linguastar — Premium eBook Platform",
  description: "Access world-class language learning books with secure, beautifully designed reading experience.",
  keywords: "ebooks, language learning, books, reading",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen antialiased" style={{ background: 'var(--bg-primary)' }}>

        {/* Background Grid */}
        <div className="fixed inset-0 grid-bg opacity-50 pointer-events-none z-0" />

        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="relative z-10">
          {children}
        </main>

        {/* Razorpay Script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />

      </body>
    </html>
  );
}