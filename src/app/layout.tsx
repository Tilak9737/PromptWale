import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://promptwale.com"),
  title: "PromptWale - AI Image Editing Prompt Library",
  description: "Explore, copy, and share the best AI image editing prompts for Gemini, Nano Banana, and more. Modern, fast, and optimized for image creators.",
  keywords: ["AI Prompts", "Image Editing", "Gemini Prompts", "Nano Banana Prompts", "Prompt Library"],
  openGraph: {
    title: "PromptWale - AI Image Editing Prompt Library",
    description: "Modern AI prompt library with before-and-after examples.",
    url: "https://promptwale.com",
    siteName: "PromptWale",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptWale - AI Image Editing Prompt Library",
    description: "Modern AI prompt library with before-and-after examples.",
    images: ["/og-image.png"],
  },
};

import { headers } from "next/headers";
import MaintenanceCheck from "@/components/ui/MaintenanceCheck";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";
  const isAdminPath = pathname.startsWith("/admin") || pathname.startsWith("/api");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen flex flex-col">
            {!isAdminPath && <MaintenanceCheck />}
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
