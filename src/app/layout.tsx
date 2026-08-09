import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CustomThemeColorProvider, ThemeBackgroundSync } from "@/lib/custom-theme-color";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const title = "Raden Fadhil Triansyah | Hardware Engineer & IoT Developer";
const description =
  "Architecting robust physical-digital bridges. Specializing in low-latency telemetry, embedded systems, and scalable IoT infrastructures. I build hardware that thinks and software that acts.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_US",
    siteName: "Raden Fadhil Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased dark scroll-pt-24 scroll-smooth`}>
      <body className="font-sans overflow-x-hidden" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <CustomThemeColorProvider>
            <ThemeBackgroundSync />
            {children}
          </CustomThemeColorProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}