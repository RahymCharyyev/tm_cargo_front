import { useTranslation } from 'react-i18next';

const FeaturesSection = () => {
  const { t } = useTranslation();

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
    <section id='features' className='py-20 bg-white'>
      <div className='max-w-6xl mx-auto px-4 text-center'>
        <h2 className='text-4xl font-bold text-gray-800 mb-12'>
          {t('featuresTitle')}
        </h2>
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {features.map(({ icon, title, desc }) => (
            <div
              key={title}
              className='p-6 rounded-2xl shadow hover:shadow-lg transition text-center'
            >
              <div className='w-20 h-20 bg-gradient-to-r from-[#3D7EF9] to-[#2B529B] rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-4'>
                {icon}
              </div>
              <h3 className='text-xl font-semibold mb-2'>{title}</h3>
              <p className='text-gray-600'>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
