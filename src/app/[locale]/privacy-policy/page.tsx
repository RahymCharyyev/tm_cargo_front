import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = 'https://tm-cargo.com.tm';
  const currentUrl = `${baseUrl}/${locale === 'tk' ? '' : locale}/privacy-policy`;

  const metadataByLocale: Record<string, Metadata> = {
    ru: {
      title: 'Политика конфиденциальности | TM Cargo',
      description: 'Политика конфиденциальности TM Cargo. Узнайте, как мы собираем, используем и защищаем ваши персональные данные на нашей платформе грузоперевозок.',
      keywords: ['политика конфиденциальности', 'защита данных', 'TM Cargo', 'персональные данные', 'безопасность'],
    },
    en: {
      title: 'Privacy Policy | TM Cargo',
      description: 'TM Cargo Privacy Policy. Learn how we collect, use, and protect your personal data on our cargo and transport platform.',
      keywords: ['privacy policy', 'data protection', 'TM Cargo', 'personal data', 'security'],
    },
    tk: {
      title: 'Gizlinlik syýasaty | TM Cargo',
      description: 'TM Cargo gizlinlik syýasaty. Ýük we ulag platformamyzda şahsy maglumatlaryňyzy nädip ýygnaýandygymyzy, ulanýandygymyzy we goraýandygymyzy öwreniň.',
      keywords: ['gizlinlik syýasaty', 'maglumatlary goramak', 'TM Cargo', 'şahsy maglumatlar', 'howpsuzlyk'],
    },
  };

  const selectedMetadata = metadataByLocale[locale] || metadataByLocale.tk;

  return {
    ...selectedMetadata,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: currentUrl,
      languages: {
        'en': `${baseUrl}/en/privacy-policy`,
        'ru': `${baseUrl}/ru/privacy-policy`,
        'tk': `${baseUrl}/privacy-policy`,
        'x-default': `${baseUrl}/privacy-policy`,
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

const PrivacyPolicyPage = () => {
  return (
    <main className='p-6 max-w-4xl mx-auto'>
      <header className='mb-8'>
        <h1 className='text-2xl font-bold mb-4'>Website Privacy Policy</h1>
      </header>

      <article className='space-y-6'>
        <section aria-labelledby='introduction'>
          <h2 id='introduction' className='text-xl font-semibold mb-2'>1. Introduction</h2>
          <p>
            This page is committed to ensuring the protection of personal
            information of users of tm-cargo.com.tm. The Privacy Policy explains
            how user data is collected, used, and protected.
          </p>
        </section>

        <section aria-labelledby='data-collection'>
          <h2 id='data-collection' className='text-xl font-semibold mb-2'>2. Data Collection</h2>
          <p>When you visit our website, the following data may be collected:</p>
          <ul className='list-disc pl-6 mt-2 space-y-1'>
            <li>
              First name, last name, and possibly other personal information
            </li>
            <li>Email address and phone numbers</li>
            <li>
              IP addresses, browser type, and information about your visit time
            </li>
            <li>Usage statistics to improve the performance of our system</li>
          </ul>
        </section>

        <section aria-labelledby='data-use'>
          <h2 id='data-use' className='text-xl font-semibold mb-2'>3. Use of Data</h2>
          <p>Collected data is used for the following purposes:</p>
          <ul className='list-disc pl-6 mt-2 space-y-1'>
            <li>Improving the services of the website</li>
            <li>Responding to user questions and suggestions</li>
            <li>Informing about updates or subscription services</li>
            <li>Ensuring security and system stability</li>
          </ul>
        </section>

        <section aria-labelledby='data-sharing'>
          <h2 id='data-sharing' className='text-xl font-semibold mb-2'>
            4. Sharing of Data with Third Parties
          </h2>
          <p>
            We do not share users' personal data with third parties. However, data
            may be shared in the following cases:
          </p>
          <ul className='list-disc pl-6 mt-2 space-y-1'>
            <li>Due to legal requirements</li>
            <li>With the user's consent</li>
          </ul>
        </section>

        <section aria-labelledby='data-security'>
          <h2 id='data-security' className='text-xl font-semibold mb-2'>5. Data Security</h2>
          <p>
            We use modern technologies and policies to protect users' data. All
            necessary precautions are taken to prevent unauthorized use or
            deletion of data.
          </p>
        </section>

        <section aria-labelledby='user-rights'>
          <h2 id='user-rights' className='text-xl font-semibold mb-2'>6. User Rights</h2>
          <p>Users have the right to:</p>
          <ul className='list-disc pl-6 mt-2 space-y-1'>
            <li>View their data</li>
            <li>Edit or correct it</li>
            <li>Delete or restrict it</li>
          </ul>
        </section>

        <section aria-labelledby='policy-changes'>
          <h2 id='policy-changes' className='text-xl font-semibold mb-2'>
            7. Changes to the Privacy Policy
          </h2>
          <p>
            This policy may be updated from time to time. Users will be informed
            about the updated policy on our website.
          </p>
        </section>

        <section aria-labelledby='contact-info'>
          <h2 id='contact-info' className='text-xl font-semibold mb-2'>8. Contact</h2>
          <p>
            If you have any questions or suggestions regarding the Privacy Policy,
            you can contact us through the following contact information:
          </p>
          <address className='mt-2 not-italic'>
            <ul className='list-disc pl-6 space-y-1'>
              <li>
                <strong>Email:</strong> 
                <a href='mailto:tm-cargo@sanly.tm' className='text-blue-600 hover:text-blue-800 ml-1'>
                  tm-cargo@sanly.tm
                </a>
              </li>
              <li>
                <strong>Phone:</strong> 
                <a href='tel:+99365552113' className='text-blue-600 hover:text-blue-800 ml-1'>
                  +993 65 55 21 13
                </a>
              </li>
            </ul>
          </address>
        </section>

        <footer className='mt-8 p-4 bg-gray-50 rounded-lg'>
          <p className='text-center font-medium'>
            We do our best to ensure the protection of our users' personal data!
          </p>
        </footer>
      </article>
    </main>
  );
};

export default PrivacyPolicyPage;
