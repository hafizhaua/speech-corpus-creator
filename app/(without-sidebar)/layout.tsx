import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ViewTransitions } from "next-view-transitions";
import { ModeToggle } from "@/components/mode-toggle";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Speech Corpus Creator",
  description:
    "A application that helps user to make their own standard speech corpus by providing recording and audio voice sample management features.",
};

export default function NonsidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            // disableTransitionOnChange
          >
            {/* <div className="fixed pointer-events-none z-20 w-full h-full">
              <div className="absolute w-64 h-64 bg-cyan-800/10 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute w-64 h-64 bg-orange-800/10 rounded-full blur-3xl top-2/3 left-2/3 -translate-x-1/2 -translate-y-1/2"></div>
            </div> */}
            <div className="relative z-10 max-w-4xl mx-auto w-11/12">
              {children}
            </div>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
