import { useTranslation } from 'react-i18next';

const DownloadSection = () => {
  const { t } = useTranslation();

  return (
    <section
      id='download'
      className='py-20 bg-gradient-to-br from-[#3D7EF9] to-[#2B529B] text-white text-center'
    >
      <div className='max-w-4xl mx-auto px-4'>
        <h2 className='text-3xl font-bold mb-4'>{t('downloadText.title')}</h2>
        <p className='mb-8'>{t('downloadText.subtitle')}</p>
        <div className='flex flex-wrap justify-center gap-6'>
          <a
            href='/tm-cargo.apk'
            target='_blank'
            download
            className='flex items-center gap-3 px-6 py-3 border border-white/30 rounded-xl backdrop-blur hover:bg-white/20 transition'
          >
            <img
              className='w-60'
              src='/google_play.png'
              alt='google play icon'
            />
          </a>
          <a
            target='_blank'
            href='https://apps.apple.com/tm/app/tmcargo/id6748551361'
            className='flex items-center gap-3 px-6 py-3 border border-white/30 rounded-xl backdrop-blur hover:bg-white/20 transition'
          >
            <img className='w-52' src='/app_store.png' alt='app store icon' />
          </a>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
