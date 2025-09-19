import { Analytics } from "@/components/common/shared/analytics";
import { TailwindIndicator } from "@/components/common/shared/tailwind-indicator";
import GlobalModals from "@/components/providers/GlobalModals";
import GoogleProvider from "@/components/providers/google.provider";
import { QueryProvider } from "@/components/providers/query.provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { fontMono, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { defaultMetadata } from "../../lib/seo";
import "../../styles/globals.css";
import NextTopLoader from "nextjs-toploader";
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

export const metadata: Metadata = defaultMetadata;

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: LocaleLayoutProps) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased -mt-6",
          fontSans.variable,
          fontMono.variable
        )}
        suppressHydrationWarning={true}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NextTopLoader color="#ff3366" />
            <GoogleProvider>
              <QueryProvider>
                <GlobalModals />
                {children}
                <TailwindIndicator />
                <Analytics />
              </QueryProvider>
            </GoogleProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}