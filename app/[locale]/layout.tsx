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
      <body className="flex min-h-full flex-col bg-[#F4F6F2] font-body text-slate-900 antialiased selection:bg-sage selection:text-forest">
        <PersonaProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {/* Top Bar Navigation */}
            <Navbar />

            {/* Main Content Area: Responsive Mobile-First Canvas */}
            <main className="flex-1 pb-28 pt-2">
              <div className="mx-auto max-w-xl sm:max-w-2xl lg:max-w-4xl px-3 sm:px-6">
                {children}
              </div>
            </main>

            {/* Footer with safety & academic disclosures */}
            <Footer />

            {/* Signature Floating Bottom Navigation from Reference Mobile UI Kit */}
            <BottomNav />
          </NextIntlClientProvider>
        </PersonaProvider>
      </body>
    </html>
  );
}
