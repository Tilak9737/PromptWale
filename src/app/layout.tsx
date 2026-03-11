import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

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



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="ambient-stage" aria-hidden="true">
            <span className="ambient-orb ambient-orb--one" />
            <span className="ambient-orb ambient-orb--two" />
            <span className="ambient-orb ambient-orb--three" />
            <span className="ambient-noise" />
          </div>
          <div className="relative site-shell flex min-h-screen flex-col">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
