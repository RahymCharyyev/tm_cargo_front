'use client';

import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Segmented,
  Select,
  Space,
  Upload,
} from 'antd';
import {
  BarChartOutlined,
  CameraOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd';
import dayjs from 'dayjs';
import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import { useCreateListing, useUploadListingImage } from '@/lib/hooks';
import { Link, useRouter } from '@/i18n/navigation';
import LocationSelect from '@/components/LocationSelect';
import VehicleTypeSelect from '@/components/VehicleTypeSelect';
import { AuthFieldLabel } from '@/components/auth/AuthSplitShell';

const SENDER_TYPES = ['cargo', 'traveler', 'load'] as const;
const LOCATION_TYPES = ['international', 'intercity', 'local'] as const;
const CURRENCIES = ['manat', 'dollar', 'euro'] as const;

type ListingRole = 'sender' | 'carrier';

export default function CreateListingPage() {
  const t = useTranslations('listing');
  const tc = useTranslations('common');
  const tFooter = useTranslations('footer');
  const locale = useLocale();
  const router = useRouter();
  const createMutation = useCreateListing();
  const uploadImage = useUploadListingImage();
  const [form] = Form.useForm();
  const [error, setError] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const dateFormat = locale === 'en' ? 'MM/DD/YYYY' : 'DD.MM.YYYY';

  const termsFooter = (
    <>
      {t('applyTermsPrefix')}{' '}
      <Link
        href='/privacy-policy'
        className='font-semibold text-[#1e40af] hover:underline'
      >
        {t('applyTermsService')}
      </Link>{' '}
      {t('applyTermsAnd')}{' '}
      <Link
        href='/privacy-policy'
        className='font-semibold text-[#1e40af] hover:underline'
      >
        {tFooter('privacyPolicy')}
      </Link>
      .
    </>
  );

  const handleSubmit = async (values: Record<string, unknown>) => {
    setError('');

    const type = values.type as string;
    const weightTons = values.weight_tons;
    const weight_kg =
      weightTons != null && weightTons !== ''
        ? Number(weightTons) * 1000
        : undefined;

    const body: Record<string, unknown> = {
      title: values.title,
      type,
      locationType: values.locationType,
      fromLocationId: values.fromLocationId,
      toLocationId: values.toLocationId,
      description: values.description || undefined,
      phone: values.phone || undefined,
      email: values.email || undefined,
      price: values.price ? Number(values.price) : undefined,
      currency: values.price ? values.currency : undefined,
      dueDate: values.dueDate
        ? dayjs(values.dueDate as dayjs.Dayjs).format('YYYY-MM-DD')
        : undefined,
    };

    if (type === 'cargo' || type === 'vehicle') {
      body.weight_kg = weight_kg;
      body.volume_m3 = values.volume_m3 ? Number(values.volume_m3) : undefined;
      body.vehicleTypeId = values.vehicleTypeId || undefined;
    }
    if (type === 'traveler') {
      body.travelerType = values.travelerType;
      body.bodyCount = Number(values.bodyCount);
      body.vehicleTypeId = values.vehicleTypeId || undefined;
    }
    if (type === 'load') {
      body.loadType = values.loadType;
      body.weight_kg = weight_kg;
      body.vehicleTypeId = values.vehicleTypeId || undefined;
    }

    createMutation.mutate(body, {
      onSuccess: async (res) => {
        const rawFiles = fileList
          .map((f) => f.originFileObj as File | undefined)
          .filter((f): f is File => Boolean(f));
        if (rawFiles.length > 0 && res.id) {
          for (const image of rawFiles) {
            await uploadImage.mutateAsync({ listingId: res.id, image });
          }
        }
        router.push(`/listings/${res.id}`);
      },
      onError: (err) => setError(err.message),
    });
  };

  const categoryOptions = LOCATION_TYPES.map((lt) => ({
    value: lt,
    label:
      lt === 'international'
        ? t('createCategoryInternational')
        : lt === 'intercity'
          ? t('createCategoryIntercity')
          : t('createCategoryLocal'),
  }));

  return (
    <div className='min-h-[calc(100dvh-4rem)] bg-[#f4f6f9]'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12'>
        <div className='grid gap-10 lg:grid-cols-12 lg:gap-12'>
          {/* Left column — hero */}
          <div className='lg:col-span-4 lg:pt-4'>
            <p className='mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-600/90 sm:text-[11px]'>
              {t('createHeroKicker')}
            </p>
            <h1 className='text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl'>
              {t('createHeroTitleBefore')}{' '}
              <span className='text-blue-700'>{t('createHeroTitleCargo')}</span>{' '}
              {t('createHeroTitleOr')}{' '}
              <span className='text-blue-900'>{t('createHeroTitleFleet')}</span>
              .
            </h1>
            <p className='mt-4 max-w-md text-sm leading-relaxed text-slate-600'>
              {t('createHeroSubtitle')}
            </p>
          </div>

          {/* Right — form card */}
          <div className='lg:col-span-8'>
            <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.25)] sm:p-8'>
              <Form
                form={form}
                layout='vertical'
                className='auth-split-form create-listing-page-form'
                initialValues={{
                  role: 'sender' satisfies ListingRole,
                  type: 'cargo',
                  locationType: 'international',
                  currency: 'manat',
                  travelerType: 'person',
                  bodyCount: 1,
                  loadType: 'load',
                }}
                onValuesChange={(changed, all) => {
                  if (changed.role === 'carrier') {
                    form.setFieldsValue({ type: 'vehicle' });
                  }
                  if (changed.role === 'sender' && all.type === 'vehicle') {
                    form.setFieldsValue({ type: 'cargo' });
                  }
                }}
                onFinish={handleSubmit}
              >
                <div className='mb-6 grid gap-4 sm:grid-cols-2'>
                  <Form.Item
                    label={<AuthFieldLabel>{t('category')}</AuthFieldLabel>}
                    name='locationType'
                    rules={[
                      { required: true, message: t('selectLocationType') },
                    ]}
                  >
                    <Select
                      size='large'
                      options={categoryOptions}
                      popupMatchSelectWidth={false}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<AuthFieldLabel>{t('createIAmA')}</AuthFieldLabel>}
                    name='role'
                    rules={[{ required: true }]}
                  >
                    <Segmented
                      block
                      options={[
                        { label: t('sender'), value: 'sender' },
                        { label: t('carrier'), value: 'carrier' },
                      ]}
                    />
                  </Form.Item>
                </div>

                <Form.Item noStyle shouldUpdate>
                  {({ getFieldValue }) =>
                    getFieldValue('role') === 'sender' ? (
                      <Form.Item
                        label={
                          <AuthFieldLabel>
                            {t('createListingTypeSender')}
                          </AuthFieldLabel>
                        }
                        name='type'
                        rules={[{ required: true }]}
                      >
                        <Select
                          size='large'
                          options={SENDER_TYPES.map((ty) => ({
                            value: ty,
                            label: t(ty),
                          }))}
                        />
                      </Form.Item>
                    ) : (
                      <Form.Item name='type' hidden>
                        <Input />
                      </Form.Item>
                    )
                  }
                </Form.Item>

                <Form.Item
                  label={
                    <AuthFieldLabel>
                      {t('createAdName')}{' '}
                      <span className='text-red-500'>*</span>
                    </AuthFieldLabel>
                  }
                  name='title'
                  rules={[{ required: true }]}
                >
                  <Input size='large' placeholder={t('placeholderAdName')} />
                </Form.Item>

                <div className='grid gap-4 sm:grid-cols-2'>
                  <div>
                    <div className='mb-1.5'>
                      <AuthFieldLabel>
                        {t('fromLocation')}{' '}
                        <span className='text-red-500'>*</span>
                      </AuthFieldLabel>
                    </div>
                    <div className='create-listing-loc-wrap flex min-h-[2.75rem] items-stretch overflow-hidden rounded-lg bg-gray-200'>
                      <span className='flex shrink-0 items-center pl-3 pr-1 text-blue-600'>
                        <EnvironmentOutlined className='text-lg' />
                      </span>
                      <Form.Item
                        name='fromLocationId'
                        noStyle
                        rules={[
                          { required: true, message: t('selectLocation') },
                        ]}
                      >
                        <LocationSelect
                          placeholder={t('placeholderFromTo')}
                          className='create-listing-loc min-w-0 flex-1 border-0'
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div>
                    <div className='mb-1.5'>
                      <AuthFieldLabel>
                        {t('toLocation')}{' '}
                        <span className='text-red-500'>*</span>
                      </AuthFieldLabel>
                    </div>
                    <div className='create-listing-loc-wrap flex min-h-[2.75rem] items-stretch overflow-hidden rounded-lg bg-gray-200'>
                      <span className='flex shrink-0 items-center pl-3 pr-1 text-red-500'>
                        <EnvironmentOutlined className='text-lg' />
                      </span>
                      <Form.Item
                        name='toLocationId'
                        noStyle
                        rules={[
                          { required: true, message: t('selectLocation') },
                        ]}
                      >
                        <LocationSelect
                          placeholder={t('placeholderFromTo')}
                          className='create-listing-loc min-w-0 flex-1 border-0'
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>

                <Form.Item noStyle shouldUpdate>
                  {({ getFieldValue }) => {
                    const type = getFieldValue('type') as string | undefined;
                    if (type === 'cargo' || type === 'vehicle') {
                      return (
                        <div className='mt-2 grid gap-4 sm:grid-cols-3'>
                          <Form.Item
                            label={
                              <AuthFieldLabel>{t('weightTons')}</AuthFieldLabel>
                            }
                            name='weight_tons'
                          >
                            <InputNumber
                              size='large'
                              min={0}
                              step={0.01}
                              placeholder='0.00'
                              className='w-full'
                            />
                          </Form.Item>
                          <Form.Item
                            label={
                              <AuthFieldLabel>{t('volumeM3')}</AuthFieldLabel>
                            }
                            name='volume_m3'
                          >
                            <InputNumber
                              size='large'
                              min={0}
                              step={0.01}
                              placeholder='0.00'
                              className='w-full'
                            />
                          </Form.Item>
                          <Form.Item
                            label={
                              <AuthFieldLabel>{t('bodyType')}</AuthFieldLabel>
                            }
                            name='vehicleTypeId'
                          >
                            <VehicleTypeSelect />
                          </Form.Item>
                        </div>
                      );
                    }
                    if (type === 'traveler') {
                      return (
                        <div className='mt-2 grid gap-4 sm:grid-cols-3'>
                          <Form.Item
                            label={
                              <AuthFieldLabel>
                                {t('travelerType')}
                              </AuthFieldLabel>
                            }
                            name='travelerType'
                            initialValue='person'
                          >
                            <Select
                              size='large'
                              options={[
                                { value: 'person', label: t('person') },
                                { value: 'vehicle', label: t('vehicle') },
                              ]}
                            />
                          </Form.Item>
                          <Form.Item
                            label={
                              <AuthFieldLabel>{t('bodyCount')}</AuthFieldLabel>
                            }
                            name='bodyCount'
                            initialValue={1}
                          >
                            <InputNumber
                              size='large'
                              min={1}
                              className='w-full'
                            />
                          </Form.Item>
                          <Form.Item
                            label={
                              <AuthFieldLabel>{t('bodyType')}</AuthFieldLabel>
                            }
                            name='vehicleTypeId'
                          >
                            <VehicleTypeSelect />
                          </Form.Item>
                        </div>
                      );
                    }
                    if (type === 'load') {
                      return (
                        <div className='mt-2 grid gap-4 sm:grid-cols-3'>
                          <Form.Item
                            label={
                              <AuthFieldLabel>{t('loadType')}</AuthFieldLabel>
                            }
                            name='loadType'
                            initialValue='load'
                          >
                            <Select
                              size='large'
                              options={[
                                { value: 'load', label: t('load') },
                                { value: 'vehicle', label: t('vehicle') },
                              ]}
                            />
                          </Form.Item>
                          <Form.Item
                            label={
                              <AuthFieldLabel>{t('weightTons')}</AuthFieldLabel>
                            }
                            name='weight_tons'
                          >
                            <InputNumber
                              size='large'
                              min={0}
                              step={0.01}
                              placeholder='0.00'
                              className='w-full'
                            />
                          </Form.Item>
                          <Form.Item
                            label={
                              <AuthFieldLabel>{t('bodyType')}</AuthFieldLabel>
                            }
                            name='vehicleTypeId'
                          >
                            <VehicleTypeSelect />
                          </Form.Item>
                        </div>
                      );
                    }
                    return null;
                  }}
                </Form.Item>

                <div className='mt-2 grid gap-4 sm:grid-cols-2'>
                  <Form.Item
                    label={
                      <AuthFieldLabel>
                        {t('createExpectedPrice')}
                      </AuthFieldLabel>
                    }
                    name='price'
                  >
                    <Space.Compact>
                      <InputNumber
                        size='large'
                        min={0}
                        placeholder={t('placeholderPriceFlexible')}
                        className='w-full'
                      />
                      {
                        <Form.Item name='currency' noStyle>
                          <Select
                            variant='borderless'
                            popupMatchSelectWidth={false}
                            options={CURRENCIES.map((c) => ({
                              value: c,
                              label: t(c),
                            }))}
                            className='min-w-[4.5rem]'
                          />
                        </Form.Item>
                      }
                    </Space.Compact>
                  </Form.Item>
                  <Form.Item
                    label={
                      <AuthFieldLabel>
                        {t('createPerformanceDate')}
                      </AuthFieldLabel>
                    }
                    name='dueDate'
                  >
                    <DatePicker
                      size='large'
                      format={dateFormat}
                      className='w-full'
                      placeholder={dateFormat.toLowerCase()}
                    />
                  </Form.Item>
                </div>

                <Form.Item
                  label={<AuthFieldLabel>{tc('description')}</AuthFieldLabel>}
                  name='description'
                >
                  <Input.TextArea
                    rows={5}
                    placeholder={t('placeholderDescriptionCreate')}
                  />
                </Form.Item>

                <div>
                  <div className='mb-2'>
                    <AuthFieldLabel>{t('images')}</AuthFieldLabel>
                  </div>
                  <Upload
                    listType='picture-card'
                    fileList={fileList}
                    onChange={({ fileList: newList }) => setFileList(newList)}
                    beforeUpload={() => false}
                    accept='image/*'
                    multiple
                  >
                    {fileList.length < 10 && (
                      <div className='text-slate-500'>
                        <CameraOutlined className='text-xl' />
                        <div className='mt-2 text-xs font-medium'>
                          {tc('upload')}
                        </div>
                      </div>
                    )}
                  </Upload>
                </div>

                <p className='mb-3 mt-6 text-sm font-semibold text-slate-800'>
                  {t('contactInfo')}
                </p>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <Form.Item
                    label={<AuthFieldLabel>{tc('phone')}</AuthFieldLabel>}
                    name='phone'
                  >
                    <Input
                      type='tel'
                      size='large'
                      placeholder={t('placeholderPhoneListing')}
                    />
                  </Form.Item>
                  <Form.Item
                    label={<AuthFieldLabel>{tc('email')}</AuthFieldLabel>}
                    name='email'
                  >
                    <Input
                      type='email'
                      size='large'
                      placeholder={t('placeholderEmailListing')}
                    />
                  </Form.Item>
                </div>

                {error ? (
                  <Alert
                    type='error'
                    message={error}
                    showIcon
                    className='mb-6 mt-2'
                  />
                ) : null}

                <Button
                  type='primary'
                  htmlType='submit'
                  block
                  size='large'
                  loading={createMutation.isPending}
                  className='auth-split-primary-btn mt-4'
                >
                  {t('applyAdvertisement')}
                </Button>

                <p className='mt-6 text-center text-xs leading-relaxed text-slate-500'>
                  {termsFooter}
                </p>

                <div className='mt-4 text-center'>
                  <button
                    type='button'
                    className='text-sm font-medium text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline'
                    onClick={() => router.back()}
                  >
                    {tc('cancel')}
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
