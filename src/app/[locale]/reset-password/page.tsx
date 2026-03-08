'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useResetPassword, useResetPasswordVerify, useResetPasswordPhoneStart, useResetPasswordPhone } from '@/lib/hooks';
import { Link, useRouter } from '@/i18n/navigation';

export default function ResetPasswordPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [mode, setMode] = useState<'email' | 'phone'>('email');

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [phone, setPhone] = useState('');
  const [phoneStep, setPhoneStep] = useState<'input' | 'newpass'>('input');

  const resetPassword = useResetPassword();
  const resetPasswordVerify = useResetPasswordVerify();
  const resetPhoneStart = useResetPasswordPhoneStart();
  const resetPhone = useResetPasswordPhone();

  const handleEmailReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (step === 'input') {
      resetPassword.mutate({ email }, {
        onSuccess: () => setStep('verify'),
        onError: (err) => setError(err.message),
      });
    } else {
      resetPasswordVerify.mutate({ email, otp, password }, {
        onSuccess: () => {
          setSuccess(t('passwordResetSuccess'));
          setTimeout(() => router.push('/login'), 1500);
        },
        onError: (err) => setError(err.message),
      });
    }
  };

  const handlePhoneReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (phoneStep === 'input') {
      resetPhoneStart.mutate({ phone }, {
        onSuccess: () => setPhoneStep('newpass'),
        onError: (err) => setError(err.message),
      });
    } else {
      resetPhone.mutate({ phone, password }, {
        onSuccess: () => router.push('/'),
        onError: (err) => setError(err.message),
      });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#3D7EF9] to-[#2B529B] px-8 py-8 text-center">
            <h1 className="text-2xl font-bold text-white">{t('resetPasswordTitle')}</h1>
          </div>

          <div className="p-8 space-y-5">
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                type="button"
                onClick={() => { setMode('email'); setStep('input'); setError(''); setSuccess(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'email' ? 'bg-white text-[#3D7EF9] shadow-sm' : 'text-gray-500'
                }`}
              >
                {t('useEmail')}
              </button>
              <button
                type="button"
                onClick={() => { setMode('phone'); setPhoneStep('input'); setError(''); setSuccess(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'phone' ? 'bg-white text-[#3D7EF9] shadow-sm' : 'text-gray-500'
                }`}
              >
                {t('usePhone')}
              </button>
            </div>

            {mode === 'email' ? (
              <form onSubmit={handleEmailReset} className="space-y-4">
                {step === 'input' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('emailLabel')}</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3D7EF9]/30 focus:border-[#3D7EF9]" />
                  </div>
                ) : (
                  <>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
                      {t('otpSent')} {email}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('otpLabel')}</label>
                      <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3D7EF9]/30 focus:border-[#3D7EF9]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('enterNewPassword')}</label>
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3D7EF9]/30 focus:border-[#3D7EF9]" placeholder="••••••••" />
                    </div>
                  </>
                )}

                {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}
                {success && <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600">{success}</div>}

                <button type="submit" disabled={resetPassword.isPending || resetPasswordVerify.isPending} className="w-full py-3 bg-gradient-to-r from-[#3D7EF9] to-[#2B529B] text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-60">
                  {step === 'input' ? t('sendOtpBtn') : t('resetBtn')}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePhoneReset} className="space-y-4">
                {phoneStep === 'input' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('phoneLabel')}</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3D7EF9]/30 focus:border-[#3D7EF9]" />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('enterNewPassword')}</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3D7EF9]/30 focus:border-[#3D7EF9]" placeholder="••••••••" />
                  </div>
                )}

                {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

                <button type="submit" disabled={resetPhoneStart.isPending || resetPhone.isPending} className="w-full py-3 bg-gradient-to-r from-[#3D7EF9] to-[#2B529B] text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-60">
                  {phoneStep === 'input' ? t('sendOtpBtn') : t('resetBtn')}
                </button>
              </form>
            )}

            <p className="text-center text-sm text-gray-500">
              <Link href="/login" className="text-[#3D7EF9] font-medium hover:underline">{t('loginBtn')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
