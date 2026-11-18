import '../globals.css';
import { notFound } from 'next/navigation';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { locales } from '@/i18n';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
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
      <body className="flex min-h-full flex-col bg-slate-50/50 font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <PersonaProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Navbar />
            <main className="flex-1 pb-12">{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </PersonaProvider>
      </body>
    </html>
  );
}
