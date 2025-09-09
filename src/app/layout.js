import { Geist, Geist_Mono, Cairo } from "next/font/google";
import "./globals.css";
import Navbar from "./Component/Navbar";
import ReduxProvider from "./Redux/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "النظام القانوني",
  description: "نظام إدارة قانونية متطور مع دعم النفاذ الوطني",
  keywords: "قانوني, النفاذ الوطني, المملكة العربية السعودية, خدمات قانونية",
  authors: [{ name: "النظام القانوني" }],
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/justice-scale.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} antialiased font-cairo`}
      >
        <ReduxProvider>
          <Navbar />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
