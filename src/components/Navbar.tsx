'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useAuthStore } from '@/lib/auth-store';
import { useLogout } from '@/lib/hooks';
import LanguageSwitcher from './LanguageSwitcher';
import { Link, usePathname } from '@/i18n/navigation';

export default function Navbar() {
  const t = useTranslations('nav');
  const { isAuthenticated, user } = useAuthStore();
  const logoutMutation = useLogout();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  const isHome = pathname === '/' || pathname.match(/^\/[a-z]{2}\/?$/);

  return (
    <header className='w-full z-50 my-[25px]'>
      <div className='max-w-[1400px] mx-auto px-4'>
        <div className='h-14 px-2 md:px-0 flex items-center justify-between'>
          <div className='flex items-center gap-8 min-w-0'>
            {/* Logo */}
            <Link href='/' className='flex items-center gap-2.5 group shrink-0'>
              <Image
                width={96}
                height={48}
                className='w-[92px] h-[48px] object-contain '
                src='/icon.webp'
                alt='TM Cargo'
              />
            </Link>

            {/* Desktop Nav - with icons */}
            <nav className='hidden lg:flex items-center gap-[20px] min-w-0'>
              {isHome ? (
                <Link
                  href='/listings'
                  className='flex items-center gap-2 rounded-md  leading-none font-medium text-[#364860] hover:bg-white/40 transition-colors whitespace-nowrap'
                >
                  <Image
                    src='/Apps List.svg'
                    alt=''
                    width={16}
                    height={16}
                    className='opacity-90'
                  />
                  {t('allListings')}
                </Link>
              ) : (
                <Link
                  href='/'
                  className='flex items-center gap-2 rounded-md  leading-none font-medium text-[#364860] hover:bg-white/40 transition-colors whitespace-nowrap'
                >
                  <svg
                    className='w-4 h-4 opacity-90'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                    />
                  </svg>
                  {t('homeLink')}
                </Link>
              )}
              <a
                href='#download'
                className='flex items-center gap-2  py-1.5 rounded-md text-[14px] leading-none font-medium text-[#364860] hover:bg-white/40 transition-colors whitespace-nowrap'
              >
                <Image
                  src='/Arrow Download.svg'
                  alt=''
                  width={16}
                  height={16}
                  className='opacity-90'
                />
                {t('downloadApp')}
              </a>
              <a
                href='#cooperation'
                className='flex items-center gap- rounded-md  leading-none font-medium text-[#364860] hover:bg-white/40 transition-colors whitespace-nowrap'
              >
                <Image
                  src='/Handshake.svg'
                  alt=''
                  width={16}
                  height={16}
                  className='opacity-90'
                />
                {t('cooperation')}
              </a>
            </nav>
          </div>

          <div className='flex items-center gap-3'>
            {isAuthenticated ? (
              <div className='relative z-50'>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className='hidden md:flex items-center gap-2 bg-white/90 border border-[#2d4f87] text-[#171717] px-5 py-2.5 rounded-full  leading-none font-semibold transition-colors hover:bg-white whitespace-nowrap'
                >
                  <Image
                    src='/Person.svg'
                    alt=''
                    width={17}
                    height={17}
                    className='opacity-80'
                  />
                  <span className='max-w-[120px] truncate'>
                    {user?.phone || user?.email || user?.fullName || 'User'}
                  </span>
                </button>
                {isUserMenuOpen && (
                  <>
                    <div
                      className='fixed inset-0'
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className='absolute right-0 mt-2 w-48 rounded-lg shadow-xl border border-gray-100 py-1 z-50'>
                      <Link
                        href='/profile'
                        className='block px-4 py-2  text-gray-700 hover:bg-gray-50'
                      >
                        {t('myListings')}
                      </Link>
                      <Link
                        href='/favorites'
                        className='block px-4 py-2  text-gray-700 hover:bg-gray-50'
                      >
                        {t('favorites')}
                      </Link>
                      <button
                        onClick={() => logoutMutation.mutate()}
                        className='w-full text-left px-4 py-2  text-red-600 hover:bg-red-50'
                      >
                        {t('logout')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href='/login'
                className='hidden md:flex items-center gap-2 border-2 border-[#2d4f87] px-5 py-2.5 rounded-[15px] text-[15px] leading-none font-semibold transition-colors hover:bg-white whitespace-nowrap'
              >
                <Image
                  src='/Person.svg'
                  alt=''
                  width={17}
                  height={17}
                  className='opacity-80'
                />
                {t('loginAndRegister')}
              </Link>
            )}

            <Link
              href={isAuthenticated ? '/listings/create' : '/login'}
              className='hidden md:flex items-center gap-2  border-2 border-[#2d4f87] px-5 py-2.5 rounded-[15px] text-[15px] leading-none font-semibold transition-colors hover:bg-white whitespace-nowrap shadow-sm'
            >
              <Image src='/Add Circle.svg' alt='' width={17} height={17} />
              {t('placeAd')}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className='lg:hidden text-[#1f3d6b] p-2'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label='Menu'
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                ) : (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='lg:hidden max-w-[1400px] mx-auto px-4 mt-2'>
          <div className='bg-white rounded-xl border border-gray-100 p-4 shadow-lg space-y-1'>
            <Link
              href='/listings'
              className='flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-50 font-medium text-gray-900'
            >
              <Image src='/Apps List.svg' alt='' width={18} height={18} />
              {t('allListings')}
            </Link>
            <a
              href='#download'
              className='flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50'
            >
              <Image src='/Arrow Download.svg' alt='' width={18} height={18} />
              {t('downloadApp')}
            </a>
            <a
              href='#cooperation'
              className='flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50'
            >
              <Image src='/Handshake.svg' alt='' width={18} height={18} />
              {t('cooperation')}
            </a>
            <div className='mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2'>
              <LanguageSwitcher />
              {!isAuthenticated && (
                <Link
                  href='/login'
                  className='flex items-center justify-center gap-2 text-white py-2.5 rounded-lg font-medium'
                >
                  <Image src='/Person.svg' alt='' width={18} height={18} />
                  {t('loginAndRegister')}
                </Link>
              )}
              <Link
                href={isAuthenticated ? '/listings/create' : '/login'}
                className='flex items-center justify-center gap-2  text-white py-2.5 rounded-lg font-medium'
              >
                <Image src='/Add Circle.svg' alt='' width={18} height={18} />
                {t('placeAd')}
              </Link>
              {isAuthenticated && (
                <>
                  <Link href='/profile' className='block py-2 text-gray-700'>
                    {t('profile')}
                  </Link>
                  <button
                    onClick={() => logoutMutation.mutate()}
                    className='block py-2 text-red-600 text-left'
                  >
                    {t('logout')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
