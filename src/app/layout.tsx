import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Vibe — AI Vibe Coding Platform",
    template: "%s | Vibe",
  },
  description:
    "Vibe is an AI-powered vibe coding platform. Describe what you want to build and watch it come to life instantly.",
  keywords: [
    "vibe coding",
    "AI coding",
    "code generation",
    "AI developer tools",
    "generative AI",
    "next.js",
  ],
  authors: [{ name: "nexcodes" }],
  creator: "Vibe",
  metadataBase: new URL("https://vibe.project.nexcodes.me"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vibe.project.nexcodes.me",
    siteName: "Vibe",
    title: "Vibe — AI Vibe Coding Platform",
    description:
      "Vibe is an AI-powered vibe coding platform. Describe what you want to build and watch it come to life instantly.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibe — AI Vibe Coding Platform",
    description:
      "Vibe is an AI-powered vibe coding platform. Describe what you want to build and watch it come to life instantly.",
    creator: "@nexcodes",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#c96342",
        },
      }}
    >
      <TRPCReactProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />
              {children}
            </ThemeProvider>
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
