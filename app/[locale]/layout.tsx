import '../globals.css';
import { notFound } from 'next/navigation';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { locales } from '@/i18n';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { BottomNav } from '@/components/bottom-nav';
import { PersonaProvider } from '@/components/persona-context';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full">
      <body className="flex min-h-full flex-col bg-[#FFF6F8] font-body text-slate-900 antialiased selection:bg-brand-pinkLight selection:text-brand-pink">
        <PersonaProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {/* Top Bar Navigation */}
            <Navbar />

            {/* Main Content Area: Responsive Mobile-First Canvas (iPhone 14/15 profile max-w-md sm:max-w-lg) */}
            <main className="flex-1 pb-24 pt-1">
              <div className="mx-auto max-w-md sm:max-w-lg px-3.5 sm:px-4">
                {children}
              </div>
            </main>

            {/* Signature Floating / Docked Bottom Navigation */}
            <BottomNav />
          </NextIntlClientProvider>
        </PersonaProvider>
      </body>
    </html>
  );
}
