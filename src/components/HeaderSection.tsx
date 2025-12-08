'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';

const HeaderSection = () => {
  const t = useTranslations();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '#home', label: t('home') },
    { href: '#features', label: t('features') },
    { href: '#download', label: t('download') },
    { href: '#contact', label: t('contact') },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-md shadow-lg'
          : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center'>
        <a
          href='#home'
          className='flex items-center gap-3 group'
        >
          <div className='relative'>
            <Image
              width={48}
              height={48}
              className='w-12 h-12 group-hover:scale-110 transition-transform duration-300'
              src='/icon.png'
              alt='Cargo TM icon'
            />
            <div className='absolute inset-0 bg-gradient-to-br from-[#3D7EF9] to-[#2B529B] rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity'></div>
          </div>
          <div className='text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D7EF9] to-[#2B529B] group-hover:from-[#2B529B] group-hover:to-[#3D7EF9] transition-all'>
            Cargo TM
          </div>
        </a>

        {/* Desktop Navigation */}
        <ul className='hidden md:flex items-center space-x-1'>
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className='px-4 py-2 text-gray-700 font-medium hover:text-[#3D7EF9] transition-colors duration-200 relative group'
              >
                {item.label}
                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3D7EF9] to-[#2B529B] group-hover:w-full transition-all duration-300'></span>
              </a>
            </li>
          ))}
          <li className='ml-4 pl-4 border-l border-gray-200'>
            <LanguageSwitcher />
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className='md:hidden p-2 text-gray-700 hover:text-[#3D7EF9] transition-colors'
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label='Toggle menu'
        >
          <svg
            className='w-6 h-6'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            {isMobileMenuOpen ? (
              <path d='M6 18L18 6M6 6l12 12' />
            ) : (
              <path d='M4 6h16M4 12h16M4 18h16' />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className='px-4 py-4 bg-white border-t border-gray-100'>
          <ul className='space-y-2'>
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='block px-4 py-3 text-gray-700 font-medium hover:text-[#3D7EF9] hover:bg-blue-50 rounded-lg transition-colors'
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className='px-4 py-3'>
              <LanguageSwitcher />
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default HeaderSection;
