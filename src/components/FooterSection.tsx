import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';

const FooterSection = async () => {
  const t = await getTranslations();

  return (
    <footer id='contact' className='relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden'>
      {/* Decorative background */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl'></div>
      </div>

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='grid md:grid-cols-3 gap-12 mb-12'>
          {/* Brand Section */}
          <div className='space-y-4'>
            <div className='flex items-center gap-3 mb-4'>
              <Image
                width={40}
                height={40}
                className='w-10 h-10'
                src='/icon.png'
                alt='Cargo TM icon'
              />
              <div className='text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D7EF9] to-[#2B529B]'>
                Cargo TM
              </div>
            </div>
            <p className='text-gray-300 leading-relaxed'>
              {t('footer.description')}
            </p>
          </div>

          {/* Contacts Section */}
          <div className='space-y-4'>
            <h3 className='text-lg font-bold mb-4 text-white'>
              {t('footer.contacts')}
            </h3>
            <div className='space-y-3'>
              <a
                href='mailto:tm-cargo@sanly.tm'
                className='flex items-center gap-3 text-gray-300 hover:text-[#3D7EF9] transition-colors group'
              >
                <svg
                  className='w-5 h-5 group-hover:scale-110 transition-transform'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
                <span>tm-cargo@sanly.tm</span>
              </a>
              <a
                href='tel:+99365607799'
                className='flex items-center gap-3 text-gray-300 hover:text-[#3D7EF9] transition-colors group'
              >
                <svg
                  className='w-5 h-5 group-hover:scale-110 transition-transform'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                  />
                </svg>
                <span>+993 65 60 77 99</span>
              </a>
            </div>
          </div>

          {/* Support Section */}
          <div className='space-y-4'>
            <h3 className='text-lg font-bold mb-4 text-white'>
              {t('footer.support')}
            </h3>
            <Link
              href='/privacy-policy'
              className='block text-gray-300 hover:text-[#3D7EF9] transition-colors group'
            >
              <span className='flex items-center gap-2'>
                <span>{t('footer.privacyPolicy')}</span>
                <svg
                  className='w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className='border-t border-gray-700/50 my-8'></div>

        {/* Copyright */}
        <div className='text-center'>
          <p className='text-sm text-gray-400'>
            &copy; {new Date().getFullYear()} Cargo TM. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
