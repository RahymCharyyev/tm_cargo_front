'use client';

import { Button, Drawer, Dropdown, Grid } from 'antd';
import type { MenuProps } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useAuthStore } from '@/lib/auth-store';
import { useLogout } from '@/lib/hooks';
import LanguageSwitcher from './LanguageSwitcher';
import { Link, usePathname } from '@/i18n/navigation';

export default function Navbar() {
  const t = useTranslations('nav');
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.lg;
  const { isAuthenticated, user } = useAuthStore();
  const logoutMutation = useLogout();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isHome = pathname === '/' || pathname.match(/^\/[a-z]{2}\/?$/);

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: <Link href='/profile'>{t('myListings')}</Link>,
    },
    {
      key: 'favorites',
      label: <Link href='/favorites'>{t('favorites')}</Link>,
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: (
        <span className='text-red-500' onClick={() => logoutMutation.mutate()}>
          {t('logout')}
        </span>
      ),
      danger: true,
    },
  ];

  return (
    <header className='w-full z-50 my-4 sm:my-[25px]'>
      <div className='max-w-[1400px] mx-auto px-4 sm:px-6'>
        <div className='h-14 flex items-center justify-between'>
          {/* Left: logo + desktop nav */}
          <div className='flex items-center gap-8 min-w-0'>
            <Link href='/'>
              <Image
                width={96}
                height={48}
                className='w-[96px] h-[48px] object-contain'
                src='/icon.webp'
                alt='TM Cargo'
              />
            </Link>

            <nav className='hidden lg:flex items-center gap-[20px]'>
              {isHome ? (
                <Link
                  href='/listings'
                  className='flex items-center gap-2 py-2 px-4 rounded-full font-medium text-[#214076] hover:bg-white transition-colors whitespace-nowrap'
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
                  className='flex items-center gap-2 py-2 px-4 rounded-full font-medium text-[#214076] hover:bg-white transition-colors whitespace-nowrap'
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
                href='/download'
                className='flex items-center gap-2 py-2 px-4 rounded-full font-medium text-[#214076] hover:bg-white transition-colors whitespace-nowrap'
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
            </nav>
          </div>

          {/* Right: auth + language + mobile toggle */}
          <div className='flex items-center gap-3'>
            {/* Desktop auth */}
            {isAuthenticated ? (
              <Dropdown
                menu={{ items: userMenuItems }}
                trigger={['click']}
                placement='bottomRight'
              >
                <Button
                  className='hidden md:flex items-center gap-2 !border-[#2B5399] !text-[#171717] !rounded-full !font-semibold'
                  style={{ height: 40, paddingInline: 20 }}
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
                </Button>
              </Dropdown>
            ) : (
              <Link href='/login'>
                <Button
                  className='hidden md:flex items-center gap-2 !border-2 !border-[#2B5399] !rounded-[15px] !font-semibold'
                  style={{ height: 40, paddingInline: 20 }}
                >
                  <Image
                    src='/Person.svg'
                    alt=''
                    width={17}
                    height={17}
                    className='opacity-80'
                  />
                  {t('loginAndRegister')}
                </Button>
              </Link>
            )}

            <Link href={isAuthenticated ? '/listings/create' : '/login'}>
              <Button
                className='hidden md:flex items-center gap-2 !border-2 !border-[#2B5399] !rounded-[15px] !font-semibold shadow-sm'
                style={{ height: 40, paddingInline: 20 }}
              >
                <Image src='/Add Circle.svg' alt='' width={17} height={17} />
                {t('placeAd')}
              </Button>
            </Link>

            {/* Mobile toggle */}
            {isMobile && (
              <Button
                className='!text-[#1f3d6b] !border-none !shadow-none'
                icon={<MenuOutlined />}
                onClick={() => setMobileOpen(true)}
                aria-label='Menu'
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          placement='left'
          size='min(100vw, 360px)'
          styles={{ body: { padding: 0 } }}
          title={
            <Image
              src='/icon.webp'
              alt='TM Cargo'
              width={80}
              height={40}
              className='object-contain'
            />
          }
        >
          <div className='p-4 space-y-1'>
            <Link
              href='/listings'
              className='flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-50 font-medium text-gray-900'
            >
              <Image src='/Apps List.svg' alt='' width={18} height={18} />
              {t('allListings')}
            </Link>
            <a
              href='/download'
              className='flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50'
            >
              <Image src='/Arrow Download.svg' alt='' width={18} height={18} />
              {t('downloadApp')}
            </a>

            <div className='mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2'>
              <LanguageSwitcher />

              {!isAuthenticated ? (
                <Link href='/login'>
                  <Button
                    type='primary'
                    block
                    icon={
                      <Image src='/Person.svg' alt='' width={18} height={18} />
                    }
                    style={{ backgroundColor: '#2d4f87' }}
                  >
                    {t('loginAndRegister')}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link
                    href='/profile'
                    className='flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50'
                  >
                    {t('myListings')}
                  </Link>
                  <Link
                    href='/favorites'
                    className='flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50'
                  >
                    {t('favorites')}
                  </Link>
                  <Button danger block onClick={() => logoutMutation.mutate()}>
                    {t('logout')}
                  </Button>
                </>
              )}

              <Link href={isAuthenticated ? '/listings/create' : '/login'}>
                <Button
                  type='primary'
                  block
                  icon={
                    <Image
                      src='/Add Circle.svg'
                      alt=''
                      width={18}
                      height={18}
                    />
                  }
                  style={{ backgroundColor: '#2d4f87' }}
                >
                  {t('placeAd')}
                </Button>
              </Link>
            </div>
          </div>
        </Drawer>
      )}
    </header>
  );
}
