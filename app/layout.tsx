import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Creator Dashboard",
  description: "Analytics dashboard for content creator management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <MobileHeader />
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}