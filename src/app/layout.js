import { geistSans, geistMono } from "@/lib/fonts";
import "./globals.css";

export const metadata = {
  title: "Fatebound",
  description: "A modern Next.js application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
