'use client';

import { Alert, Button, Form, Input, Segmented, Space } from 'antd';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLogin } from '@/lib/hooks';
import { Link, useRouter } from '@/i18n/navigation';
import {
  AuthFieldLabel,
  AuthSplitShell,
} from '@/components/auth/AuthSplitShell';

export default function LoginPage() {
  const t = useTranslations('auth');
  const tFooter = useTranslations('footer');
  const router = useRouter();
  const loginMutation = useLogin();
  const [mode, setMode] = useState<'email' | 'phone'>('email');
  const [error, setError] = useState('');
  const [form] = Form.useForm();

  const handleSubmit = (values: {
    email?: string;
    phone?: string;
    password: string;
  }) => {
    setError('');
    const phone = values.phone
      ? `+993${values.phone.replace(/^\+993/, '')}`
      : undefined;
    loginMutation.mutate(
      mode === 'email'
        ? { email: values.email!, password: values.password }
        : { phone: phone!, password: values.password },
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

  return (
    <AuthSplitShell
      formTitle={t('loginTitle')}
      heroTitle={t('authHeroTitleLogin')}
      heroSubtitle={t('authHeroSubtitleLogin')}
      termsFooter={termsFooter}
      footer={
        <p className='text-center text-sm text-slate-600'>
          {t('noAccount')}{' '}
          <Link
            href='/register'
            className='font-bold text-[#1e3a8a] hover:underline'
          >
            {t('registerBtn')}
          </Link>
        </p>
      }
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Form.Item className='mb-6'>
          <Segmented
            block
            value={mode}
            onChange={(v) => {
              setMode(v as 'email' | 'phone');
              form.resetFields();
              setError('');
            }}
            options={[
              { value: 'email', label: t('useEmail') },
              { value: 'phone', label: t('usePhone') },
            ]}
          />
        </Form.Item>

        {mode === 'email' ? (
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
        ) : (
          <Form.Item
            label={<AuthFieldLabel>{t('phoneLabel')}</AuthFieldLabel>}
            name='phone'
            rules={[{ required: true }]}
            className='mb-5'
          >
            <Input
              type='tel'
              prefix='+993'
              placeholder='6X XXXXXX'
              size='large'
            />
          </Form.Item>
        )}

        <Form.Item
          label={
            <div className='flex w-full items-center justify-between gap-3'>
              <AuthFieldLabel>{t('passwordLabel')}</AuthFieldLabel>
              <Link
                href='/reset-password'
                className='text-[11px] font-bold uppercase tracking-wide text-[#1e40af] hover:underline'
              >
                {t('forgotPassword')}
              </Link>
            </div>
          }
          name='password'
          rules={[{ required: true }]}
          className='mb-2'
        >
          <Input.Password placeholder='••••••••' size='large' />
        </Form.Item>

        {error && (
          <Form.Item className='mb-4'>
            <Alert type='error' title={error} showIcon />
          </Form.Item>
        )}

        <div className='mt-6 flex flex-col gap-3'>
          <Button
            type='primary'
            htmlType='submit'
            block
            size='large'
            loading={loginMutation.isPending}
            className='auth-split-primary-btn'
          >
            {t('loginBtn')}
          </Button>
          <Link
            href='/register'
            className='flex h-12 w-full items-center justify-center rounded-lg border border-sky-200 bg-white text-xs font-semibold uppercase tracking-[0.08em] text-[#1e3a8a] transition-colors hover:border-[#1e3a8a] hover:bg-slate-50'
          >
            {t('registerBtn')}
          </Link>
        </div>
      </Form>
    </AuthSplitShell>
  );
}
