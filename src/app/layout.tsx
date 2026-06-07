import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
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
  title: "Avinash | Software Engineer & AI/ML",
  description:
    "Portfolio of Margana Vasu Deva Sujith Avinash — Software Engineer & AI/ML Student at VIT-AP University. Building machine learning systems and software products.",
  keywords: [
    "Avinash",
    "Software Engineer",
    "AI/ML",
    "Machine Learning",
    "Deep Learning",
    "Python",
    "Next.js",
    "VIT-AP",
    "Portfolio",
  ],
  authors: [{ name: "Margana Vasu Deva Sujith Avinash" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Avinash | Software Engineer & AI/ML",
    description:
      "Building machine learning systems and software products from first principles.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Avinash | Software Engineer & AI/ML",
    description:
      "Building machine learning systems and software products from first principles.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
