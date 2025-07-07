import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <div className='space-x-2'>
      <button
        className='cursor-pointer'
        onClick={() => i18n.changeLanguage('ru')}
      >
        🇷🇺
      </button>
      <button
        className='cursor-pointer'
        onClick={() => i18n.changeLanguage('tk')}
      >
        🇹🇲
      </button>
      <button
        className='cursor-pointer'
        onClick={() => i18n.changeLanguage('en')}
      >
        🇺🇸
      </button>
    </div>
  );
};

export default LanguageSwitcher;
