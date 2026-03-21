'use client';

import { Alert, Button, Form, Input, Segmented } from 'antd';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLogin } from '@/lib/hooks';
import { Link, useRouter } from '@/i18n/navigation';

export default function LoginPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const loginMutation = useLogin();
  const [mode, setMode] = useState<'email' | 'phone'>('email');
  const [error, setError] = useState('');
  const [form] = Form.useForm();

  const handleSubmit = (values: { email?: string; phone?: string; password: string }) => {
    setError('');
    loginMutation.mutate(
      mode === 'email'
        ? { email: values.email!, password: values.password }
        : { phone: values.phone!, password: values.password },
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
            <h1 className="text-2xl font-bold text-white">{t('loginTitle')}</h1>
          </div>

          <div className="p-8">
            <Form form={form} layout="vertical" onFinish={handleSubmit} className="space-y-0">
              <Form.Item className="mb-5">
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
                  label={t('emailLabel')}
                  name="email"
                  rules={[{ required: true, type: 'email' }]}
                >
                  <Input type="email" placeholder="name@example.com" size="large" />
                </Form.Item>
              ) : (
                <Form.Item
                  label={t('phoneLabel')}
                  name="phone"
                  rules={[{ required: true }]}
                >
                  <Input type="tel" placeholder="+993 6X XXXXXX" size="large" />
                </Form.Item>
              )}

              <Form.Item
                label={t('passwordLabel')}
                name="password"
                rules={[{ required: true }]}
              >
                <Input.Password placeholder="••••••••" size="large" />
              </Form.Item>

              {error && (
                <Form.Item>
                  <Alert type="error" message={error} showIcon />
                </Form.Item>
              )}

              <Form.Item className="mb-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={loginMutation.isPending}
                  style={{
                    background: 'linear-gradient(to right, #3D7EF9, #2B529B)',
                    border: 'none',
                    borderRadius: 12,
                    height: 48,
                    fontWeight: 500,
                  }}
                >
                  {t('loginBtn')}
                </Button>
              </Form.Item>

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
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
