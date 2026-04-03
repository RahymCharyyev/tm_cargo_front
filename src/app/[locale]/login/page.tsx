'use client';

import { Alert, Button, Form, Input, Segmented } from 'antd';
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

  return (
    <AuthSplitShell
      formTitle={t('loginTitle')}
      heroTitle={t('authHeroTitleLogin')}
      heroSubtitle={t('authHeroSubtitleLogin')}
      showHeroOverlay={false}
      showHeroText={false}
      formPaneClassName='!bg-[#E8F2FF] lg:!bg-[#E8F2FF]'
    >
      <Form
        form={form}
        className='auth-pane-form'
        layout='vertical'
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Form.Item className='mb-6'>
          <Segmented
            className='login-mode-segmented'
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
              className='!h-[46px] !rounded-[15px]'
            />
          </Form.Item>
        ) : (
          <Form.Item
            label={<AuthFieldLabel>{t('phoneLabel')}</AuthFieldLabel>}
            name='phone'
            rules={[{ required: true, message: t('validationPhoneRequired') }]}
            className='mb-5'
          >
            <Input
              type='tel'
              prefix='+993'
              placeholder='6X XXXXXX'
              size='large'
              className='!h-[46px] !rounded-[15px]'
            />
          </Form.Item>
        )}

        <Form.Item
          label={<AuthFieldLabel>{t('passwordLabel')}</AuthFieldLabel>}
          className='login-password-row mb-2'
        >
          <div className='relative'>
            <Link
              href='/reset-password'
              className='login-reset-password-link absolute right-0 bottom-full z-[1] mb-1 text-[14px] font-medium text-[#1e40af] hover:underline'
            >
              {t('resetBtn')}
            </Link>
            <Form.Item
              name='password'
              noStyle
              rules={[
                { required: true, message: t('validationPasswordRequired') },
              ]}
            >
              <Input.Password
                placeholder='••••••••'
                size='large'
                className='!h-[46px] !rounded-[15px]'
              />
            </Form.Item>
          </div>
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
            loading={loginMutation.isPending}
            className='auth-split-primary-btn'
          >
            {t('loginBtn')}
          </Button>
          <p className='text-center text-sm text-slate-600'>{t('noAccount')}</p>
          <Link
            href='/register'
            className='login-register-link auth-split-outline-btn flex h-[46px] w-full items-center justify-center rounded-[15px] border border-sky-200 bg-white text-[15px] font-semibold uppercase tracking-[0.08em] text-[#1e3a8a] transition-colors'
          >
            {t('registerBtn')}
          </Link>
        </div>
      </Form>
    </AuthSplitShell>
  );
}
