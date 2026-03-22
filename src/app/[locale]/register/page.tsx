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
import {
  AuthFieldLabel,
  AuthSplitShell,
} from '@/components/auth/AuthSplitShell';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const tFooter = useTranslations('footer');
  const router = useRouter();
  const [mode, setMode] = useState<'email' | 'phone'>('email');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [phoneStep, setPhoneStep] = useState<'input' | 'waiting' | 'complete'>(
    'input',
  );
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

  const handleEmailVerify = (values: {
    otp: string;
    fullName: string;
    password: string;
  }) => {
    setError('');
    registerVerify.mutate(
      {
        email,
        otp: values.otp,
        fullName: values.fullName,
        password: values.password,
      },
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

  const handlePhoneComplete = (values: {
    fullName: string;
    password: string;
  }) => {
    setError('');
    registerByPhone.mutate(
      { phone, fullName: values.fullName, password: values.password },
      {
        onSuccess: () => router.push('/'),
        onError: (err) => setError(err.message),
      },
    );
  };

  const termsFooter = (
    <>
      {t('authTermsContinue')}{' '}
      <Link
        href='/privacy-policy'
        className='font-semibold text-[#1e40af] hover:underline'
      >
        {t('authTermsOfService')}
      </Link>{' '}
      {t('authTermsAnd')}{' '}
      <Link
        href='/privacy-policy'
        className='font-semibold text-[#1e40af] hover:underline'
      >
        {tFooter('privacyPolicy')}
      </Link>
      .
    </>
  );

  const secondaryLogin = (
    <Link
      href='/login'
      className='flex h-12 w-full items-center justify-center rounded-lg border border-sky-200 bg-white text-xs font-semibold uppercase tracking-[0.08em] text-[#1e3a8a] transition-colors hover:border-[#1e3a8a] hover:bg-slate-50'
    >
      {t('loginBtn')}
    </Link>
  );

  return (
    <AuthSplitShell
      formTitle={t('registerTitle')}
      heroKicker={t('authHeroKicker')}
      heroTitle={t('authHeroTitleRegister')}
      heroSubtitle={t('authHeroSubtitleRegister')}
      termsFooter={termsFooter}
      footer={
        <p className='text-center text-sm text-slate-600'>
          {t('hasAccount')}{' '}
          <Link
            href='/login'
            className='font-bold text-[#1e3a8a] hover:underline'
          >
            {t('loginBtn')}
          </Link>
        </p>
      }
    >
      <div className='space-y-6'>
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
            <Form
              form={emailForm}
              layout='vertical'
              onFinish={handleEmailStep1}
              requiredMark={false}
            >
              <Form.Item
                label={<AuthFieldLabel>{t('emailLabel')}</AuthFieldLabel>}
                name='email'
                rules={[{ required: true, type: 'email' }]}
                className='mb-5'
              >
                <Input
                  type='email'
                  placeholder={t('placeholderEmailCompany')}
                  size='large'
                />
              </Form.Item>
              {error && (
                <Alert type='error' title={error} showIcon className='mb-4' />
              )}
              <div className='flex flex-col gap-3'>
                <Button
                  type='primary'
                  htmlType='submit'
                  block
                  size='large'
                  loading={registerEmail.isPending}
                  className='auth-split-primary-btn'
                >
                  {t('sendOtpBtn')}
                </Button>
                {secondaryLogin}
              </div>
            </Form>
          ) : (
            <Form
              form={verifyForm}
              layout='vertical'
              onFinish={handleEmailVerify}
              requiredMark={false}
            >
              <Alert
                type='info'
                message={`${t('otpSent')} ${email}`}
                showIcon
                className='mb-5'
              />
              <Form.Item
                label={<AuthFieldLabel>{t('otpLabel')}</AuthFieldLabel>}
                name='otp'
                rules={[{ required: true }]}
                className='mb-4'
              >
                <Input placeholder='123456' size='large' />
              </Form.Item>
              <Form.Item
                label={<AuthFieldLabel>{t('fullNameLabel')}</AuthFieldLabel>}
                name='fullName'
                rules={[{ required: true }]}
                className='mb-4'
              >
                <Input placeholder={t('placeholderFullName')} size='large' />
              </Form.Item>
              <Form.Item
                label={<AuthFieldLabel>{t('passwordLabel')}</AuthFieldLabel>}
                name='password'
                rules={[{ required: true }]}
                className='mb-4'
              >
                <Input.Password placeholder='••••••••' size='large' />
              </Form.Item>
              {error && (
                <Alert type='error' title={error} showIcon className='mb-4' />
              )}
              <div className='flex flex-col gap-3'>
                <Button
                  type='primary'
                  htmlType='submit'
                  block
                  size='large'
                  loading={registerVerify.isPending}
                  className='auth-split-primary-btn'
                >
                  {t('registerBtn')}
                </Button>
                {secondaryLogin}
              </div>
            </Form>
          )
        ) : (
          <>
            {phoneStep === 'input' && (
              <Form
                form={phoneForm}
                layout='vertical'
                onFinish={handlePhoneStep1}
                requiredMark={false}
              >
                <Form.Item
                  label={<AuthFieldLabel>{t('phoneLabel')}</AuthFieldLabel>}
                  name='phone'
                  rules={[{ required: true }]}
                  className='mb-5'
                >
                  <Input type='tel' placeholder='+993 6X XXXXXX' size='large' />
                </Form.Item>
                {error && (
                  <Alert
                    type='error'
                    message={error}
                    showIcon
                    className='mb-4'
                  />
                )}
                <div className='flex flex-col gap-3'>
                  <Button
                    type='primary'
                    htmlType='submit'
                    block
                    size='large'
                    loading={isPhoneRegisterable.isPending}
                    className='auth-split-primary-btn'
                  >
                    {t('sendOtpBtn')}
                  </Button>
                  {secondaryLogin}
                </div>
              </Form>
            )}

            {phoneStep === 'waiting' && (
              <div className='space-y-4 py-6 text-center'>
                <Spin size='large' />
                <p className='text-sm text-slate-600'>{t('phoneWaiting')}</p>
              </div>
            )}

            {phoneStep === 'complete' && (
              <Form
                layout='vertical'
                onFinish={handlePhoneComplete}
                requiredMark={false}
              >
                <Alert
                  type='success'
                  message={`✓ ${t('phoneLabel')}: ${phone}`}
                  showIcon
                  className='mb-5'
                />
                <Form.Item
                  label={<AuthFieldLabel>{t('fullNameLabel')}</AuthFieldLabel>}
                  name='fullName'
                  rules={[{ required: true }]}
                  className='mb-4'
                >
                  <Input placeholder={t('placeholderFullName')} size='large' />
                </Form.Item>
                <Form.Item
                  label={<AuthFieldLabel>{t('passwordLabel')}</AuthFieldLabel>}
                  name='password'
                  rules={[{ required: true }]}
                  className='mb-4'
                >
                  <Input.Password placeholder='••••••••' size='large' />
                </Form.Item>
                {error && (
                  <Alert
                    type='error'
                    message={error}
                    showIcon
                    className='mb-4'
                  />
                )}
                <div className='flex flex-col gap-3'>
                  <Button
                    type='primary'
                    htmlType='submit'
                    block
                    size='large'
                    loading={registerByPhone.isPending}
                    className='auth-split-primary-btn'
                  >
                    {t('registerBtn')}
                  </Button>
                  {secondaryLogin}
                </div>
              </Form>
            )}
          </>
        )}
      </div>
    </AuthSplitShell>
  );
}
