import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";
import lightLogo from '@/public/images/logo-light.png'
import darkLogo from '@/public/images/logo-dark.png'


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
      <body>
        <header className="flex justify-center py-4 bg-background">
          <div className="block dark:hidden">
            <Image
              src={lightLogo}
              alt="Mobarrez Logo - Light Mode"
              width={150}
              height={50}
            />
          </div>
          <div className="hidden dark:block">
            <Image
              src={darkLogo}
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