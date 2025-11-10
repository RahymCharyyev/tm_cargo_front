import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <section className='bg-blue-600 text-white h-screen flex flex-col justify-center items-center text-center px-4'>
        <h1 className='text-4xl md:text-6xl font-bold mb-4'>
          SanjarTransportCorp – Logistics & Cargo Transport
        </h1>
        <p className='text-lg md:text-2xl mb-6'>
          Cargo TM is a program owned by SanjarTransportCorp that helps you find
          drivers or ship your cargo quickly and securely.
        </p>
      </section>
      <section className='py-20 px-4 max-w-6xl mx-auto'>
        <h2 className='text-3xl font-bold text-center mb-12'>
          Why Choose SanjarTransportCorp
        </h2>
        <div className='grid md:grid-cols-3 gap-8'>
          <div className='bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center'>
            <h3 className='font-bold text-xl mb-2'>Fast Connections</h3>
            <p>Connect with drivers and cargo owners within minutes.</p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center'>
            <h3 className='font-bold text-xl mb-2'>Secure Transactions</h3>
            <p>
              All agreements and payments are processed safely through our
              platform.
            </p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center'>
            <h3 className='font-bold text-xl mb-2'>User-Friendly</h3>
            <p>
              Simple interface to post listings and find transportation
              efficiently.
            </p>
          </div>
        </div>
      </section>
      <section className='bg-gray-100 py-20 px-4'>
        <h2 className='text-3xl font-bold text-center mb-12'>How It Works</h2>
        <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
          <div className='text-center'>
            <div className='text-5xl mb-4'>📦</div>
            <h3 className='font-bold text-xl mb-2'>Post Your Cargo</h3>
            <p>Create a listing for your cargo or shipment.</p>
          </div>
          <div className='text-center'>
            <div className='text-5xl mb-4'>🚚</div>
            <h3 className='font-bold text-xl mb-2'>Find a Driver</h3>
            <p>Our system matches you with nearby available drivers.</p>
          </div>
          <div className='text-center'>
            <div className='text-5xl mb-4'>✅</div>
            <h3 className='font-bold text-xl mb-2'>Ship Safely</h3>
            <p>
              Track your shipment and confirm delivery through the platform.
            </p>
          </div>
        </div>
      </section>
      <section className='py-20 text-center bg-blue-600 text-white'>
        <h2 className='text-3xl font-bold mb-6'>
          Join SanjarTransportCorp Today
        </h2>
        <a
          href='mailto:sanjartranscorp@gmail.com'
          className='bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition'
        >
          Contact Us
        </a>
      </section>
      <footer className='bg-gray-800 text-white py-6 text-center'>
        <p>&copy; 2025 SanjarTransportCorp. All rights reserved.</p>
        <p>Contact: sanjartranscorp@gmail.com</p>
        <p className='mt-2'>
          <Link
            href='/privacy-policy'
            className='underline hover:text-gray-400'
          >
            Privacy Policy
          </Link>
        </p>
      </footer>
    </main>
  );
}
