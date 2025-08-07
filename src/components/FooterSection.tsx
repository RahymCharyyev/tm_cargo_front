import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

const FooterSection = async () => {
  const t = await getTranslations();

  return (
    <footer id='contact' className='bg-gray-900 text-white py-12'>
      <div className='max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-sm'>
        <div>
          <h3 className='font-semibold mb-2'>TmCargo</h3>
          <p>{t('footer.description')}</p>
        </div>
        <div>
          <h3 className='font-semibold mb-2'>{t('footer.contacts')}</h3>
          <p>
            {t('footer.emailLabel')}{' '}
            <Link
              href='mailto:tm-cargo@sanly.tm'
              className='text-[#3D7EF9] hover:underline'
            >
              tm-cargo@sanly.tm
            </Link>
          </p>
          <p>
            {t('footer.phoneLabel')}{' '}
            <Link
              href='tel:+99365607799'
              className='text-[#3D7EF9] hover:underline'
            >
              +993 65 60 77 99
            </Link>
          </p>
        </div>
        <div>
          <h3 className='font-semibold mb-2'>{t('footer.support')}</h3>
          <p>
            <Link href='/privacy-policy' className='hover:text-[#3D7EF9]'>
              {t('footer.privacyPolicy')}
            </Link>
          </p>
        </div>
      </div>
      <p className='mt-8 text-center text-xs text-gray-400'>
        &copy; {new Date().getFullYear()} TmCargo. {t('footer.rights')}
      </p>
    </footer>
  );
};

export default FooterSection;
