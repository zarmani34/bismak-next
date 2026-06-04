import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/provider";

export const metadata: Metadata = {
  title: "Bismak Excel Technical Services",
  description: "Welcome to Bismak excel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
