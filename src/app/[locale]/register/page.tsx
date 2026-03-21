'use client';

import { Alert, Button, Form, Input, Segmented, Spin } from 'antd';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  useRegisterEmail,
  useRegisterVerify,
  useIsPhoneRegisterable,
  useIsPhoneVerified,
  useRegisterByPhone,
} from '@/lib/hooks';
import { Link, useRouter } from '@/i18n/navigation';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [mode, setMode] = useState<'email' | 'phone'>('email');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [phoneStep, setPhoneStep] = useState<'input' | 'waiting' | 'complete'>('input');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [emailForm] = Form.useForm();
  const [verifyForm] = Form.useForm();
  const [phoneForm] = Form.useForm();

  const registerEmail = useRegisterEmail();
  const registerVerify = useRegisterVerify();
  const isPhoneRegisterable = useIsPhoneRegisterable();
  const isPhoneVerified = useIsPhoneVerified();
  const registerByPhone = useRegisterByPhone();

  const handleEmailStep1 = (values: { email: string }) => {
    setError('');
    setEmail(values.email);
    registerEmail.mutate(
      { email: values.email },
      {
        onSuccess: () => setStep('verify'),
        onError: (err) => setError(err.message),
      },
    );
  };

  const handleEmailVerify = (values: { otp: string; fullName: string; password: string }) => {
    setError('');
    registerVerify.mutate(
      { email, otp: values.otp, fullName: values.fullName, password: values.password },
      {
        onSuccess: () => router.push('/'),
        onError: (err) => setError(err.message),
      },
    );
  };

  const handlePhoneStep1 = (values: { phone: string }) => {
    setError('');
    setPhone(values.phone);
    isPhoneRegisterable.mutate(
      { phone: values.phone },
      {
        onSuccess: () => {
          setPhoneStep('waiting');
          const interval = setInterval(() => {
            isPhoneVerified.mutate(
              { phone: values.phone },
              {
                onSuccess: () => {
                  clearInterval(interval);
                  setPhoneStep('complete');
                },
              },
            );
          }, 3000);
          setTimeout(() => clearInterval(interval), 120000);
        },
        onError: (err) => setError(err.message),
      },
    );
  };

  const handlePhoneComplete = (values: { fullName: string; password: string }) => {
    setError('');
    registerByPhone.mutate(
      { phone, fullName: values.fullName, password: values.password },
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
          <div className="bg-gradient-to-r from-[#3D7EF9] to-[#2B529B] px-8 py-8 text-center">
            <h1 className="text-2xl font-bold text-white">{t('registerTitle')}</h1>
          </div>

          <div className="p-8 space-y-5">
            <Segmented
              block
              value={mode}
              onChange={(v) => {
                setMode(v as 'email' | 'phone');
                setStep('input');
                setPhoneStep('input');
                setError('');
                emailForm.resetFields();
                verifyForm.resetFields();
                phoneForm.resetFields();
              }}
              options={[
                { value: 'email', label: t('useEmail') },
                { value: 'phone', label: t('usePhone') },
              ]}
            />

            {mode === 'email' ? (
              step === 'input' ? (
                <Form form={emailForm} layout="vertical" onFinish={handleEmailStep1}>
                  <Form.Item
                    label={t('emailLabel')}
                    name="email"
                    rules={[{ required: true, type: 'email' }]}
                  >
                    <Input type="email" placeholder="name@example.com" size="large" />
                  </Form.Item>
                  {error && <Alert type="error" message={error} showIcon className="mb-4" />}
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={registerEmail.isPending}
                    style={{
                      background: 'linear-gradient(to right, #3D7EF9, #2B529B)',
                      border: 'none',
                      borderRadius: 12,
                      height: 48,
                      fontWeight: 500,
                    }}
                  >
                    {t('sendOtpBtn')}
                  </Button>
                </Form>
              ) : (
                <Form form={verifyForm} layout="vertical" onFinish={handleEmailVerify}>
                  <Alert
                    type="info"
                    message={`${t('otpSent')} ${email}`}
                    showIcon
                    className="mb-4"
                  />
                  <Form.Item
                    label={t('otpLabel')}
                    name="otp"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="123456" size="large" />
                  </Form.Item>
                  <Form.Item
                    label={t('fullNameLabel')}
                    name="fullName"
                    rules={[{ required: true }]}
                  >
                    <Input size="large" />
                  </Form.Item>
                  <Form.Item
                    label={t('passwordLabel')}
                    name="password"
                    rules={[{ required: true }]}
                  >
                    <Input.Password placeholder="••••••••" size="large" />
                  </Form.Item>
                  {error && <Alert type="error" message={error} showIcon className="mb-4" />}
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={registerVerify.isPending}
                    style={{
                      background: 'linear-gradient(to right, #3D7EF9, #2B529B)',
                      border: 'none',
                      borderRadius: 12,
                      height: 48,
                      fontWeight: 500,
                    }}
                  >
                    {t('registerBtn')}
                  </Button>
                </Form>
              )
            ) : (
              <>
                {phoneStep === 'input' && (
                  <Form form={phoneForm} layout="vertical" onFinish={handlePhoneStep1}>
                    <Form.Item
                      label={t('phoneLabel')}
                      name="phone"
                      rules={[{ required: true }]}
                    >
                      <Input type="tel" placeholder="+993 6X XXXXXX" size="large" />
                    </Form.Item>
                    {error && <Alert type="error" message={error} showIcon className="mb-4" />}
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      loading={isPhoneRegisterable.isPending}
                      style={{
                        background: 'linear-gradient(to right, #3D7EF9, #2B529B)',
                        border: 'none',
                        borderRadius: 12,
                        height: 48,
                        fontWeight: 500,
                      }}
                    >
                      {t('sendOtpBtn')}
                    </Button>
                  </Form>
                )}

                {phoneStep === 'waiting' && (
                  <div className="text-center py-8 space-y-4">
                    <Spin size="large" />
                    <p className="text-sm text-gray-600">{t('phoneWaiting')}</p>
                  </div>
                )}

                {phoneStep === 'complete' && (
                  <Form layout="vertical" onFinish={handlePhoneComplete}>
                    <Alert
                      type="success"
                      message={`✓ ${t('phoneLabel')}: ${phone}`}
                      showIcon
                      className="mb-4"
                    />
                    <Form.Item
                      label={t('fullNameLabel')}
                      name="fullName"
                      rules={[{ required: true }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item
                      label={t('passwordLabel')}
                      name="password"
                      rules={[{ required: true }]}
                    >
                      <Input.Password placeholder="••••••••" size="large" />
                    </Form.Item>
                    {error && <Alert type="error" message={error} showIcon className="mb-4" />}
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      loading={registerByPhone.isPending}
                      style={{
                        background: 'linear-gradient(to right, #3D7EF9, #2B529B)',
                        border: 'none',
                        borderRadius: 12,
                        height: 48,
                        fontWeight: 500,
                      }}
                    >
                      {t('registerBtn')}
                    </Button>
                  </Form>
                )}
              </>
            )}

            <p className="text-center text-sm text-gray-500">
              {t('hasAccount')}{' '}
              <Link href="/login" className="text-[#3D7EF9] font-medium hover:underline">
                {t('loginBtn')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
