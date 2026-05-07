import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "Book Access App",
  description: "Secure eBook platform with protected access",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased bg-gray-50 text-gray-900">

        {/* Main App Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Razorpay Script (Global Load) */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />

      </body>
    </html>
  );
}