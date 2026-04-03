'use client';

import { Alert, Button, Form, Input, Segmented } from 'antd';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  useResetPassword,
  useResetPasswordVerify,
  useResetPasswordPhoneStart,
  useResetPasswordPhone,
} from '@/lib/hooks';
import { Link, useRouter } from '@/i18n/navigation';
import {
  AuthFieldLabel,
  AuthSplitShell,
} from '@/components/auth/AuthSplitShell';

export default function ResetPasswordPage() {
  const t = useTranslations('auth');
  const tFooter = useTranslations('footer');
  const router = useRouter();
  const [mode, setMode] = useState<'email' | 'phone'>('email');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [phoneStep, setPhoneStep] = useState<'input' | 'newpass'>('input');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [emailForm] = Form.useForm();
  const [verifyForm] = Form.useForm();
  const [phoneForm] = Form.useForm();
  const [phonePassForm] = Form.useForm();

  const resetPassword = useResetPassword();
  const resetPasswordVerify = useResetPasswordVerify();
  const resetPhoneStart = useResetPasswordPhoneStart();
  const resetPhone = useResetPasswordPhone();

  const handleEmailStep1 = (values: { email: string }) => {
    setError('');
    setSuccess('');
    setEmail(values.email);
    resetPassword.mutate(
      { email: values.email },
      {
        onSuccess: () => setStep('verify'),
        onError: (err) => setError(err.message),
      },
    );
  };

  const handleEmailVerify = (values: { otp: string; password: string }) => {
    setError('');
    setSuccess('');
    resetPasswordVerify.mutate(
      { email, otp: values.otp, password: values.password },
      {
        onSuccess: () => {
          setSuccess(t('passwordResetSuccess'));
          setTimeout(() => router.push('/login'), 1500);
        },
        onError: (err) => setError(err.message),
      },
    );
  };

  const handlePhoneStep1 = (values: { phone: string }) => {
    setError('');
    setSuccess('');
    const fullPhone = `+993${values.phone.replace(/^\+993/, '')}`;
    setPhone(fullPhone);
    resetPhoneStart.mutate(
      { phone: fullPhone },
      {
        onSuccess: () => setPhoneStep('newpass'),
        onError: (err) => setError(err.message),
      },
    );
  };

  const handlePhoneReset = (values: { password: string }) => {
    setError('');
    setSuccess('');
    resetPhone.mutate(
      { phone, password: values.password },
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

  const inputClass = '!h-[46px] !rounded-[15px]';

  return (
    <AuthSplitShell
      formTitle={t('resetPasswordTitle')}
      heroTitle={t('authHeroTitleReset')}
      heroSubtitle={t('authHeroSubtitleReset')}
      showHeroOverlay={false}
      showHeroText={false}
      formPaneClassName='!bg-[#E8F2FF] lg:!bg-[#E8F2FF]'
      termsFooter={termsFooter}
      footer={
        <p className='text-center text-sm text-slate-600'>
          <Link
            href='/login'
            className='font-bold text-[#1e3a8a] hover:underline'
          >
            ← {t('loginBtn')}
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
            setSuccess('');
            emailForm.resetFields();
            verifyForm.resetFields();
            phoneForm.resetFields();
            phonePassForm.resetFields();
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
            {success && (
              <Form.Item className='mb-4'>
                <Alert type='success' message={success} showIcon />
              </Form.Item>
            )}
            <div className='mt-[25px]'>
              <Button
                type='primary'
                htmlType='submit'
                block
                size='large'
                loading={resetPassword.isPending}
                className='auth-split-primary-btn'
              >
                {t('sendOtpBtn')}
              </Button>
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
              message={`${t('otpSent')} ${email}`}
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
              label={<AuthFieldLabel>{t('enterNewPassword')}</AuthFieldLabel>}
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
            {success && (
              <Form.Item className='mb-4'>
                <Alert type='success' message={success} showIcon />
              </Form.Item>
            )}
            <div className='mt-[25px]'>
              <Button
                type='primary'
                htmlType='submit'
                block
                size='large'
                loading={resetPasswordVerify.isPending}
                className='auth-split-primary-btn'
              >
                {t('resetBtn')}
              </Button>
            </div>
          </Form>
        )
      ) : phoneStep === 'input' ? (
        <Form
          form={phoneForm}
          className='auth-pane-form'
          layout='vertical'
          onFinish={handlePhoneStep1}
          requiredMark={false}
        >
          <Form.Item
            label={<AuthFieldLabel>{t('phoneLabel')}</AuthFieldLabel>}
            name='phone'
            rules={[{ required: true, message: t('validationPhoneRequired') }]}
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
          <div className='mt-[25px]'>
            <Button
              type='primary'
              htmlType='submit'
              block
              size='large'
              loading={resetPhoneStart.isPending}
              className='auth-split-primary-btn'
            >
              {t('sendOtpBtn')}
            </Button>
          </div>
        </Form>
      ) : (
        <Form
          form={phonePassForm}
          className='auth-pane-form'
          layout='vertical'
          onFinish={handlePhoneReset}
          requiredMark={false}
        >
          <Form.Item
            label={<AuthFieldLabel>{t('enterNewPassword')}</AuthFieldLabel>}
            name='password'
            rules={[{ required: true, message: t('validationPasswordRequired') }]}
            className='mb-5'
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
          <div className='mt-[25px]'>
            <Button
              type='primary'
              htmlType='submit'
              block
              size='large'
              loading={resetPhone.isPending}
              className='auth-split-primary-btn'
            >
              {t('resetBtn')}
            </Button>
          </div>
        </Form>
      )}
    </AuthSplitShell>
  );
}
