import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Sidebar } from "@/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import MobileMenu from "@/components/mobile-menu";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Speech Corpus Creator",
  description:
    "A eb application that helps user to make their own standard speech corpus by providing recording and audio voice sample management features.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          // disableTransitionOnChange
        >
          <ResizablePanelGroup direction="horizontal" className="w-full">
            <ResizablePanel
              defaultSize={25}
              minSize={20}
              maxSize={50}
              className="hidden md:block"
            >
              <Sidebar />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={75}>
              <ScrollArea className="h-screen">
                <div className="block lg:hidden">
                  <MobileMenu />
                </div>
                <div className="w-screen md:w-auto">{children}</div>
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
