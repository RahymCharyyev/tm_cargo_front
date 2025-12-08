import { getTranslations } from 'next-intl/server';

const FeaturesSection = async () => {
  const t = await getTranslations();

  const features = [
    {
      icon: '🌍',
      title: t('featuresText.0.title'),
      desc: t('featuresText.0.desc'),
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '🚛',
      title: t('featuresText.1.title'),
      desc: t('featuresText.1.desc'),
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: '🤝',
      title: t('featuresText.2.title'),
      desc: t('featuresText.2.desc'),
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: '📱',
      title: t('featuresText.3.title'),
      desc: t('featuresText.3.desc'),
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <section id='features' className='py-24 bg-gradient-to-b from-white to-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            {t('featuresTitle')}
          </h2>
          <div className='w-24 h-1 bg-gradient-to-r from-[#3D7EF9] to-[#2B529B] mx-auto rounded-full'></div>
        </div>
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {features.map(({ icon, title, desc, gradient }, index) => (
            <div
              key={title}
              className='group relative p-8 rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100'
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}></div>
              
              {/* Icon container */}
              <div className={`relative w-20 h-20 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                <span className='filter drop-shadow-lg'>{icon}</span>
              </div>
              
              {/* Content */}
              <h3 className='text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-[#3D7EF9] transition-colors'>
                {title}
              </h3>
              <p className='text-gray-600 text-center leading-relaxed'>
                {desc}
              </p>
              
              {/* Decorative corner */}
              <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 rounded-bl-3xl transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
