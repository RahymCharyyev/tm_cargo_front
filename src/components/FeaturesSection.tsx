import { getTranslations } from 'next-intl/server';

const FeaturesSection = async () => {
  const t = await getTranslations();

  const features = [
    {
      icon: '🌍',
      title: t('featuresText.0.title'),
      desc: t('featuresText.0.desc'),
    },
    {
      icon: '🚛',
      title: t('featuresText.1.title'),
      desc: t('featuresText.1.desc'),
    },
    {
      icon: '🤝',
      title: t('featuresText.2.title'),
      desc: t('featuresText.2.desc'),
    },
    {
      icon: '📱',
      title: t('featuresText.3.title'),
      desc: t('featuresText.3.desc'),
    },
  ];

  return (
    <section 
      id='features' 
      className='py-20 bg-white'
      aria-labelledby='features-title'
      role='region'
    >
      <div className='max-w-6xl mx-auto px-4 text-center'>
        <header className='mb-12'>
          <h2 id='features-title' className='text-4xl font-bold text-gray-800'>
            {t('featuresTitle')}
          </h2>
        </header>
        <div 
          className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'
          role='list'
          aria-label='TM Cargo features and benefits'
        >
          {features.map(({ icon, title, desc }, index) => (
            <article
              key={title}
              className='p-6 rounded-2xl shadow hover:shadow-lg transition text-center'
              role='listitem'
              aria-labelledby={`feature-${index}-title`}
            >
              <div 
                className='w-20 h-20 bg-gradient-to-r from-[#3D7EF9] to-[#2B529B] rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-4'
                role='img'
                aria-label={`Feature icon: ${icon}`}
              >
                {icon}
              </div>
              <h3 id={`feature-${index}-title`} className='text-xl font-semibold mb-2'>
                {title}
              </h3>
              <p className='text-gray-600'>{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
