'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLogin } from '@/lib/hooks';
import { Link, useRouter } from '@/i18n/navigation';

export default function LoginPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const loginMutation = useLogin();
  const [mode, setMode] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate(
      mode === 'email' ? { email, password } : { phone, password },
      {
        onSuccess: () => router.push('/'),
        onError: (err) => setError(err.message),
      },
    );
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#3D7EF9] to-[#2B529B] px-8 py-8 text-center">
            <h1 className="text-2xl font-bold text-white">{t('loginTitle')}</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {/* Mode Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setMode('email')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'email' ? 'bg-white text-[#3D7EF9] shadow-sm' : 'text-gray-500'
                }`}
              >
                {t('useEmail')}
              </button>
              <button
                type="button"
                onClick={() => setMode('phone')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'phone' ? 'bg-white text-[#3D7EF9] shadow-sm' : 'text-gray-500'
                }`}
              >
                {t('usePhone')}
              </button>
            </div>

            {mode === 'email' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('emailLabel')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3D7EF9]/30 focus:border-[#3D7EF9] transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('phoneLabel')}</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3D7EF9]/30 focus:border-[#3D7EF9] transition-colors"
                  placeholder="+993 6X XXXXXX"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('passwordLabel')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3D7EF9]/30 focus:border-[#3D7EF9] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3 bg-gradient-to-r from-[#3D7EF9] to-[#2B529B] text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-60"
            >
              {loginMutation.isPending ? '...' : t('loginBtn')}
            </button>

            <div className="text-center space-y-2 text-sm">
              <Link href="/reset-password" className="block text-[#3D7EF9] hover:underline">
                {t('forgotPassword')}
              </Link>
              <p className="text-gray-500">
                {t('noAccount')}{' '}
                <Link href="/register" className="text-[#3D7EF9] font-medium hover:underline">
                  {t('registerBtn')}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
