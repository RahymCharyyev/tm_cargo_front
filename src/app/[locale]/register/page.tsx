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
    const fullPhone = `+993${values.phone.replace(/^\+993/, '')}`;
    setPhone(fullPhone);
    isPhoneRegisterable.mutate(
      { phone: fullPhone },
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
        {tFooter('privacyPolicy')}
      </Link>
      .
    </>
  );

  const secondaryLogin = (
    <Link
      href='/login'
      className='auth-outline-cta auth-split-outline-btn auth-no-caps flex h-[46px] w-full items-center justify-center rounded-[15px] border border-sky-200 bg-white text-[15px] font-semibold text-[#1e3a8a] transition-colors'
    >
      {t('loginBtn')}
    </Link>
  );

  const inputClass = '!h-[46px] !rounded-[15px]';

  return (
    <AuthSplitShell
      formTitle={t('registerTitle')}
      heroTitle={t('authHeroTitleRegister')}
      heroSubtitle={t('authHeroSubtitleRegister')}
      showHeroOverlay={false}
      showHeroText={false}
      formPaneClassName='!bg-[#E8F2FF] lg:!bg-[#E8F2FF]'
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
      <div className='mb-6'>
        <Segmented
          className='login-mode-segmented'
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
      </div>

      {mode === 'email' ? (
        step === 'input' ? (
          <Form
            form={emailForm}
            className='auth-pane-form'
            layout='vertical'
            onFinish={handleEmailStep1}
            requiredMark={false}
          >
            <Form.Item
              label={<AuthFieldLabel>{t('emailLabel')}</AuthFieldLabel>}
              name='email'
              rules={[
                { required: true, message: t('validationEmailRequired') },
                { type: 'email', message: t('validationEmailInvalid') },
              ]}
              className='mb-5'
            >
              <Input
                type='email'
                placeholder={t('placeholderEmailCompany')}
                size='large'
                className={inputClass}
              />
            </Form.Item>
            {error && (
              <Form.Item className='mb-4'>
                <Alert type='error' title={error} showIcon />
              </Form.Item>
            )}
            <div className='mt-[25px] flex flex-col gap-[25px]'>
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
            className='auth-pane-form'
            layout='vertical'
            onFinish={handleEmailVerify}
            requiredMark={false}
          >
            <Alert
              type='info'
              title={`${t('otpSent')} ${email}`}
              showIcon
              className='mb-5'
            />
            <Form.Item
              label={<AuthFieldLabel>{t('otpLabel')}</AuthFieldLabel>}
              name='otp'
              rules={[{ required: true, message: t('validationOtpRequired') }]}
              className='mb-4'
            >
              <Input placeholder='123456' size='large' className={inputClass} />
            </Form.Item>
            <Form.Item
              label={<AuthFieldLabel>{t('fullNameLabel')}</AuthFieldLabel>}
              name='fullName'
              rules={[
                { required: true, message: t('validationFullNameRequired') },
              ]}
              className='mb-4'
            >
              <Input
                placeholder={t('placeholderFullName')}
                size='large'
                className={inputClass}
              />
            </Form.Item>
            <Form.Item
              label={<AuthFieldLabel>{t('passwordLabel')}</AuthFieldLabel>}
              name='password'
              rules={[
                { required: true, message: t('validationPasswordRequired') },
              ]}
              className='mb-4'
            >
              <Input.Password
                placeholder='••••••••'
                size='large'
                className={inputClass}
              />
            </Form.Item>
            {error && (
              <Form.Item className='mb-4'>
                <Alert type='error' title={error} showIcon />
              </Form.Item>
            )}
            <div className='mt-[25px] flex flex-col gap-[25px]'>
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
              className='auth-pane-form'
              layout='vertical'
              onFinish={handlePhoneStep1}
              requiredMark={false}
            >
              <Form.Item
                label={
                  <span className='text-sm font-medium text-black'>
                    {t('phoneLabel')}
                  </span>
                }
                name='phone'
                rules={[
                  { required: true, message: t('validationPhoneRequired') },
                ]}
                className='mb-5'
              >
                <Input
                  prefix='+993'
                  type='tel'
                  placeholder='6X XXXXXX'
                  size='large'
                  className={inputClass}
                />
              </Form.Item>
              {error && (
                <Form.Item className='mb-4'>
                  <Alert type='error' title={error} showIcon />
                </Form.Item>
              )}
              <div className='mt-[25px] flex flex-col gap-[25px]'>
                <Button
                  type='primary'
                  htmlType='submit'
                  block
                  size='large'
                  loading={isPhoneRegisterable.isPending}
                className='auth-split-primary-btn auth-no-caps'
                >
                  {t('sendOtpBtn')}
                </Button>
                {secondaryLogin}
              </div>
            </Form>
          )}

          {phoneStep === 'waiting' && (
            <div className='flex flex-col items-center gap-4 py-10 text-center'>
              <Spin size='large' />
              <p className='text-sm text-slate-600'>{t('phoneWaiting')}</p>
            </div>
          )}

          {phoneStep === 'complete' && (
            <Form
              className='auth-pane-form'
              layout='vertical'
              onFinish={handlePhoneComplete}
              requiredMark={false}
            >
              <Alert
                type='success'
                title={`✓ ${t('phoneLabel')}: ${phone}`}
                showIcon
                className='mb-5'
              />
              <Form.Item
                label={<AuthFieldLabel>{t('fullNameLabel')}</AuthFieldLabel>}
                name='fullName'
                rules={[
                  { required: true, message: t('validationFullNameRequired') },
                ]}
                className='mb-4'
              >
                <Input
                  placeholder={t('placeholderFullName')}
                  size='large'
                  className={inputClass}
                />
              </Form.Item>
              <Form.Item
                label={<AuthFieldLabel>{t('passwordLabel')}</AuthFieldLabel>}
                name='password'
                rules={[
                  { required: true, message: t('validationPasswordRequired') },
                ]}
                className='mb-4'
              >
                <Input.Password
                  placeholder='••••••••'
                  size='large'
                  className={inputClass}
                />
              </Form.Item>
              {error && (
                <Form.Item className='mb-4'>
                  <Alert type='error' title={error} showIcon />
                </Form.Item>
              )}
              <div className='mt-[25px] flex flex-col gap-[25px]'>
                <Button
                  type='primary'
                  htmlType='submit'
                  block
                  size='large'
                  loading={registerByPhone.isPending}
                  className='auth-split-primary-btn auth-no-caps'
                >
                  {t('registerBtn')}
                </Button>
                {secondaryLogin}
              </div>
            </Form>
          )}
        </>
      )}
    </AuthSplitShell>
  );
}
