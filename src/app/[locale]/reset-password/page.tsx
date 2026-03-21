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

export default function ResetPasswordPage() {
  const t = useTranslations('auth');
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
    setPhone(values.phone);
    resetPhoneStart.mutate(
      { phone: values.phone },
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

  const primaryButtonStyle = {
    background: 'linear-gradient(to right, #3D7EF9, #2B529B)',
    border: 'none',
    borderRadius: 12,
    height: 48,
    fontWeight: 500,
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#3D7EF9] to-[#2B529B] px-8 py-8 text-center">
            <h1 className="text-2xl font-bold text-white">{t('resetPasswordTitle')}</h1>
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

            {mode === 'email' ? (
              step === 'input' ? (
                <Form form={emailForm} layout="vertical" onFinish={handleEmailStep1}>
                  <Form.Item
                    label={t('emailLabel')}
                    name="email"
                    rules={[{ required: true, type: 'email' }]}
                  >
                    <Input type="email" size="large" />
                  </Form.Item>
                  {error && <Alert type="error" message={error} showIcon className="mb-4" />}
                  {success && <Alert type="success" message={success} showIcon className="mb-4" />}
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={resetPassword.isPending}
                    style={primaryButtonStyle}
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
                    <Input size="large" />
                  </Form.Item>
                  <Form.Item
                    label={t('enterNewPassword')}
                    name="password"
                    rules={[{ required: true }]}
                  >
                    <Input.Password placeholder="••••••••" size="large" />
                  </Form.Item>
                  {error && <Alert type="error" message={error} showIcon className="mb-4" />}
                  {success && <Alert type="success" message={success} showIcon className="mb-4" />}
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={resetPasswordVerify.isPending}
                    style={primaryButtonStyle}
                  >
                    {t('resetBtn')}
                  </Button>
                </Form>
              )
            ) : (
              phoneStep === 'input' ? (
                <Form form={phoneForm} layout="vertical" onFinish={handlePhoneStep1}>
                  <Form.Item
                    label={t('phoneLabel')}
                    name="phone"
                    rules={[{ required: true }]}
                  >
                    <Input type="tel" size="large" />
                  </Form.Item>
                  {error && <Alert type="error" message={error} showIcon className="mb-4" />}
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={resetPhoneStart.isPending}
                    style={primaryButtonStyle}
                  >
                    {t('sendOtpBtn')}
                  </Button>
                </Form>
              ) : (
                <Form form={phonePassForm} layout="vertical" onFinish={handlePhoneReset}>
                  <Form.Item
                    label={t('enterNewPassword')}
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
                    loading={resetPhone.isPending}
                    style={primaryButtonStyle}
                  >
                    {t('resetBtn')}
                  </Button>
                </Form>
              )
            )}

            <p className="text-center text-sm text-gray-500">
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
