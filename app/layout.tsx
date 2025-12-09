import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI-Powered Lead Dashboard",
  description: "Real-time lead tracking, enrichment, and AI scoring for elite ops.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-display antialiased">
        <header className="flex justify-center py-4 bg-background">
          <div className="block dark:hidden">
            <Image
              src="/images/logo-dark.png"
              alt="Mobarrez Logo - Light Mode"
              width={150}
              height={50}
            />
          </div>
          <div className="hidden dark:block">
            <Image
              src="/images/logo-light.png"
              alt="Mobarrez Logo - Dark Mode"
              width={150}
              height={50}
            />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}