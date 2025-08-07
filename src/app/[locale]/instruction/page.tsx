/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';
import Image from 'next/image';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = 'https://tm-cargo.com.tm';
  const currentUrl = `${baseUrl}/${locale === 'tk' ? '' : locale}/instruction`;

  const metadataByLocale: Record<string, Metadata> = {
    ru: {
      title: 'Инструкция по удалению аккаунта | TM Cargo',
      description: 'Пошаговая инструкция по удалению аккаунта в мобильном приложении TM Cargo. Простые шаги для безопасного удаления вашей учетной записи.',
      keywords: ['удаление аккаунта', 'инструкция', 'TM Cargo', 'мобильное приложение', 'безопасность'],
    },
    en: {
      title: 'Account Deletion Instructions | TM Cargo',
      description: 'Step-by-step instructions for deleting your account in the TM Cargo mobile application. Simple steps for safe account deletion.',
      keywords: ['account deletion', 'instructions', 'TM Cargo', 'mobile app', 'security'],
    },
    tk: {
      title: 'Hasaby pozuş görkezmeleri | TM Cargo',
      description: 'TM Cargo mobil programmasynda hasabyňyzy pozmak üçin ädimme-ädim görkezmeler. Hasabyňyzy howpsuz pozmak üçin ýönekeý ädimler.',
      keywords: ['hasaby pozmak', 'görkezmeler', 'TM Cargo', 'mobil programma', 'howpsuzlyk'],
    },
  };

  const selectedMetadata = metadataByLocale[locale] || metadataByLocale.tk;

  return {
    ...selectedMetadata,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: currentUrl,
      languages: {
        'en': `${baseUrl}/en/instruction`,
        'ru': `${baseUrl}/ru/instruction`,
        'tk': `${baseUrl}/instruction`,
        'x-default': `${baseUrl}/instruction`,
      },
    },
    openGraph: {
      title: selectedMetadata.title,
      description: selectedMetadata.description,
      url: currentUrl,
      type: 'article',
      locale: locale === 'ru' ? 'ru_RU' : locale === 'en' ? 'en_US' : 'tk_TM',
      siteName: 'TM Cargo',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const InstructionPage = () => {
  return (
    <main className='flex flex-col items-center gap-5 p-6 max-w-4xl mx-auto text-center'>
      <header className='mb-8'>
        <h1 className='text-2xl font-bold mb-4'>Delete Account!</h1>
      </header>
      
      <article className='space-y-8'>
        <section aria-labelledby='step-1'>
          <figure>
            <Image
              src='/instruction_1.jpeg'
              alt='TM Cargo mobile app profile page showing Delete Account button location'
              width={300}
              height={500}
              className='rounded-lg shadow-md'
              loading='lazy'
            />
            <figcaption id='step-1' className='text-xl mt-4 font-medium'>
              Step 1: Go to the profile page and click the "Delete Account" button!
            </figcaption>
          </figure>
        </section>

        <section aria-labelledby='step-2'>
          <figure>
            <Image
              src='/instruction_2.jpeg'
              alt='TM Cargo mobile app confirmation dialog for account deletion'
              width={300}
              height={500}
              className='rounded-lg shadow-md'
              loading='lazy'
            />
            <figcaption id='step-2' className='text-xl mt-4 font-medium'>
              Step 2: Then click the "Confirm" button to permanently delete your account!
            </figcaption>
          </figure>
        </section>
      </article>
    </main>
  );
};

export default InstructionPage;
