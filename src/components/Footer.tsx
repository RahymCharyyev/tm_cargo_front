'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className='bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'>
      <div className='max-w-[1470px] mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid md:grid-cols-3 gap-8 mb-8'>
          {/* Brand */}
          <div className='space-y-3'>
            <div className='flex items-center gap-3'>
              <Image
                width={36}
                height={36}
                className='w-9 h-9'
                src='/icon.webp'
                alt='Cargo TM'
              />
              <span className='text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D7EF9] to-[#2B529B]'>
                Cargo TM
              </span>
            </div>
            <p className='text-gray-400 text-sm leading-relaxed'>
              {t('description')}
            </p>
          </div>

          {/* Contacts */}
          <div>
            <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3'>
              {t('contacts')}
            </h3>
            <div className='space-y-2'>
              <a
                href='mailto:tm-cargo@sanly.tm'
                className='flex items-center gap-2 text-gray-300 hover:text-[#3D7EF9] text-sm transition-colors'
              >
                <svg
                  className='w-4 h-4'
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
                tm-cargo@sanly.tm
              </a>
              <a
                href='tel:+99365607799'
                className='flex items-center gap-2 text-gray-300 hover:text-[#3D7EF9] text-sm transition-colors'
              >
                <svg
                  className='w-4 h-4'
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
                +993 65 60 77 99
              </a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3'>
              {t('support')}
            </h3>
            <Link
              href='/privacy-policy'
              className='text-gray-300 hover:text-[#3D7EF9] text-sm transition-colors'
            >
              {t('privacyPolicy')}
            </Link>
          </div>
        </div>

        <div className='border-t border-gray-700/50 pt-6'>
          <p className='text-center text-xs text-gray-500'>
            &copy; {new Date().getFullYear()} Cargo TM. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
