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
  Switch,
  Upload,
} from 'antd';
import {
  CameraOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd';
import dayjs from 'dayjs';
import { useTranslations, useLocale } from 'next-intl';
import { use, useEffect, useState } from 'react';
import { useListing, useEditListing, useUploadListingImage } from '@/lib/hooks';
import { Link, useRouter } from '@/i18n/navigation';
import LocationSelect from '@/components/LocationSelect';
import VehicleTypeSelect from '@/components/VehicleTypeSelect';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AuthFieldLabel } from '@/components/auth/AuthSplitShell';
import Image from 'next/image';

const CREATE_CATEGORIES = ['international', 'intercity', 'local', 'traveler', 'load'] as const;
type CreateCategory = (typeof CREATE_CATEGORIES)[number];

const CURRENCIES = ['manat', 'dollar', 'euro'] as const;

const blockLetters: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (/[a-zA-Zа-яА-ЯёЁ]/.test(e.key)) e.preventDefault();
};

function getSubcategoryOptions(
  category: CreateCategory,
  t: (key: string) => string,
): { label: string; value: string }[] {
  if (category === 'traveler') {
    return [
      { label: t('filterSubPassenger'), value: 'sub1' },
      { label: t('filterSubCar'), value: 'sub2' },
    ];
  }
  return [
    { label: t('sender'), value: 'sub1' },
    { label: t('carrier'), value: 'sub2' },
  ];
}

function deriveApiFields(category: CreateCategory, subcategory: string, routeType?: string) {
  if (category === 'international' || category === 'intercity' || category === 'local') {
    return {
      locationType: category,
      type: subcategory === 'sub1' ? 'cargo' : 'vehicle',
      travelerType: undefined,
      loadType: undefined,
    };
  }
  if (category === 'traveler') {
    return {
      locationType: routeType || 'international',
      type: 'traveler' as const,
      travelerType: subcategory === 'sub1' ? 'person' : 'vehicle',
      loadType: undefined,
    };
  }
  return {
    locationType: routeType || 'international',
    type: 'load' as const,
    travelerType: undefined,
    loadType: subcategory === 'sub1' ? 'load' : 'vehicle',
  };
}

function categoryFromListing(type: string, locationType: string): CreateCategory {
  if (type === 'traveler') return 'traveler';
  if (type === 'load') return 'load';
  return locationType as CreateCategory;
}

function subcategoryFromListing(
  type: string,
  travelerType?: string,
  loadType?: string,
): string {
  if (type === 'traveler') return travelerType === 'vehicle' ? 'sub2' : 'sub1';
  if (type === 'load') return loadType === 'vehicle' ? 'sub2' : 'sub1';
  return type === 'vehicle' ? 'sub2' : 'sub1';
}

export default function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations('listing');
  const tc = useTranslations('common');
  const th = useTranslations('home');
  const tFooter = useTranslations('footer');
  const locale = useLocale();
  const router = useRouter();
  const { data: listing, isLoading } = useListing(id);
  const editMutation = useEditListing(id);
  const uploadImage = useUploadListingImage();
  const [form] = Form.useForm();
  const [error, setError] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [initialized, setInitialized] = useState(false);

  const dateFormat = locale === 'en' ? 'MM/DD/YYYY' : 'DD.MM.YYYY';

  useEffect(() => {
    if (listing && !initialized) {
      setInitialized(true);

      const cat = categoryFromListing(listing.type, listing.locationType);
      const sub = subcategoryFromListing(
        listing.type,
        listing.traveler?.travelerType,
        listing.load?.loadType,
      );

      const weightKg =
        listing.cargo?.weight_kg ??
        listing.vehicle?.weight_kg ??
        listing.load?.weight_kg ??
        undefined;
      const weightTons =
        weightKg != null ? weightKg / 1000 : undefined;

      const phoneRaw = listing.phone || '';
      const phoneWithout993 = phoneRaw.replace(/^\+993/, '');

      form.setFieldsValue({
        category: cat,
        subcategory: sub,
        title: listing.title,
        fromLocationId: listing.fromLocationId,
        toLocationId: listing.toLocationId,
        price: listing.price ?? undefined,
        currency: listing.currency || 'manat',
        description: listing.description || '',
        phone: phoneWithout993,
        email: listing.email || '',
        dueDate: listing.dueDate ? dayjs(listing.dueDate) : undefined,
        weight_tons: weightTons,
        volume_m3:
          listing.cargo?.volume_m3 ?? listing.vehicle?.volume_m3 ?? undefined,
        vehicleTypeId:
          listing.cargo?.vehicleTypeId ||
          listing.vehicle?.vehicleTypeId ||
          listing.traveler?.vehicleTypeId ||
          listing.load?.vehicleTypeId ||
          undefined,
        bodyCount: listing.traveler?.bodyCount ?? 1,
        isActive: listing.isActive,
      });
    }
  }, [listing, initialized, form]);

  if (isLoading) return <LoadingSpinner />;

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

    const category = values.category as CreateCategory;
    const subcategory = (values.subcategory as string) || 'sub1';
    const routeType = values.routeType as string | undefined;
    const derived = deriveApiFields(category, subcategory, routeType);

    const weightTons = values.weight_tons;
    const weight_kg =
      weightTons != null && weightTons !== ''
        ? Number(weightTons) * 1000
        : undefined;

    const body: Record<string, unknown> = {
      title: values.title,
      type: derived.type,
      locationType: derived.locationType,
      fromLocationId: values.fromLocationId,
      toLocationId: values.toLocationId,
      description: values.description || undefined,
      phone: values.phone ? `+993${String(values.phone).replace(/^\+993/, '')}` : undefined,
      email: values.email || undefined,
      price: values.price ? Number(values.price) : undefined,
      currency: values.price ? values.currency : undefined,
      dueDate: values.dueDate
        ? dayjs(values.dueDate as dayjs.Dayjs).format('YYYY-MM-DD')
        : undefined,
      isActive: values.isActive,
    };

    if (derived.type === 'cargo' || derived.type === 'vehicle') {
      body.weight_kg = weight_kg;
      body.volume_m3 = values.volume_m3 ? Number(values.volume_m3) : undefined;
      body.vehicleTypeId = values.vehicleTypeId || undefined;
    }
    if (derived.type === 'traveler') {
      body.travelerType = derived.travelerType;
      body.bodyCount = Number(values.bodyCount) || 1;
      body.vehicleTypeId = values.vehicleTypeId || undefined;
    }
    if (derived.type === 'load') {
      body.loadType = derived.loadType;
      body.weight_kg = weight_kg;
      body.vehicleTypeId = values.vehicleTypeId || undefined;
    }

    editMutation.mutate(body, {
      onSuccess: async () => {
        const rawFiles = fileList
          .map((f) => f.originFileObj as File | undefined)
          .filter((f): f is File => Boolean(f));
        if (rawFiles.length > 0) {
          for (const image of rawFiles) {
            await uploadImage.mutateAsync({ listingId: id, image });
          }
        }
        router.push(`/listings/${id}`);
      },
      onError: (err) => setError(err.message),
    });
  };

  const categoryOptions = [
    {
      label: th('cargoTransport'),
      options: CREATE_CATEGORIES.filter((cat) =>
        ['international', 'intercity', 'local'].includes(cat),
      ).map((cat) => ({
        value: cat,
        label: t(`filterCat${cat.charAt(0).toUpperCase()}${cat.slice(1)}` as never),
      })),
    },
    {
      label: th('smallTransport'),
      options: CREATE_CATEGORIES.filter((cat) => ['traveler', 'load'].includes(cat)).map(
        (cat) => ({
          value: cat,
          label: t(`filterCat${cat.charAt(0).toUpperCase()}${cat.slice(1)}` as never),
        }),
      ),
    },
  ];

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
              {t('editTitle')}
            </h1>
            <p className='mt-4 max-w-md text-sm leading-relaxed text-slate-600'>
              {t('createHeroSubtitle')}
            </p>

            {listing?.images && listing.images.length > 0 && (
              <div className='mt-6'>
                <p className='text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3'>
                  {t('images')}
                </p>
                <div className='grid grid-cols-3 gap-2'>
                  {listing.images.map((img) => (
                    <Image
                      key={img.id}
                      src={`https://tm-cargo.com.tm/api/${img.filename}`}
                      alt=''
                      width={120}
                      height={80}
                      crossOrigin='anonymous'
                      className='w-full h-20 object-cover rounded-xl'
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — form card */}
          <div className='lg:col-span-8'>
            <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.25)] sm:p-8'>
              <Form
                form={form}
                layout='vertical'
                className='auth-split-form create-listing-page-form'
                initialValues={{
                  category: 'international' as CreateCategory,
                  subcategory: 'sub1',
                  currency: 'manat',
                  bodyCount: 1,
                  isActive: true,
                }}
                onValuesChange={(changed) => {
                  if (changed.category) {
                    form.setFieldsValue({ subcategory: 'sub1' });
                  }
                }}
                onFinish={handleSubmit}
              >
                <div className='mb-6 grid gap-4 sm:grid-cols-2'>
                  <Form.Item
                    label={<AuthFieldLabel>{t('category')}</AuthFieldLabel>}
                    name='category'
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

                  <Form.Item noStyle shouldUpdate={(prev, cur) => prev.category !== cur.category}>
                    {({ getFieldValue }) => {
                      const cat = getFieldValue('category') as CreateCategory;
                      const opts = getSubcategoryOptions(cat, t as (key: string) => string);
                      return (
                        <Form.Item
                          label={<AuthFieldLabel>{t('createIAmA')}</AuthFieldLabel>}
                          name='subcategory'
                          rules={[{ required: true }]}
                        >
                          <Segmented
                            block
                            options={opts}
                          />
                        </Form.Item>
                      );
                    }}
                  </Form.Item>
                </div>

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
                  <Form.Item
                    label={
                      <AuthFieldLabel>
                        {t('fromLocation')}{' '}
                        <span className='text-red-500'>*</span>
                      </AuthFieldLabel>
                    }
                    name='fromLocationId'
                    rules={[
                      { required: true, message: t('selectLocation') },
                    ]}
                  >
                    <LocationSelect
                      size='large'
                      placeholder={t('placeholderFromTo')}
                      prefix={<EnvironmentOutlined className='text-blue-600' />}
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <AuthFieldLabel>
                        {t('toLocation')}{' '}
                        <span className='text-red-500'>*</span>
                      </AuthFieldLabel>
                    }
                    name='toLocationId'
                    rules={[
                      { required: true, message: t('selectLocation') },
                    ]}
                  >
                    <LocationSelect
                      size='large'
                      placeholder={t('placeholderFromTo')}
                      prefix={<EnvironmentOutlined className='text-red-500' />}
                    />
                  </Form.Item>
                </div>

                {/* Type-specific fields */}
                <Form.Item noStyle shouldUpdate>
                  {({ getFieldValue }) => {
                    const cat = getFieldValue('category') as CreateCategory;
                    const sub = getFieldValue('subcategory') as string;
                    const derived = deriveApiFields(cat, sub);

                    if (derived.type === 'cargo' || derived.type === 'vehicle') {
                      return (
                        <div className='mt-2 grid gap-4 sm:grid-cols-3'>
                          <Form.Item
                            label={<AuthFieldLabel>{t('weightTons')}</AuthFieldLabel>}
                            name='weight_tons'
                          >
                            <InputNumber
                              size='large'
                              min={0}
                              step={0.01}
                              placeholder='0.00'
                              className='w-full'
                              onKeyDown={blockLetters}
                            />
                          </Form.Item>
                          <Form.Item
                            label={<AuthFieldLabel>{t('volumeM3')}</AuthFieldLabel>}
                            name='volume_m3'
                          >
                            <InputNumber
                              size='large'
                              min={0}
                              step={0.01}
                              placeholder='0.00'
                              className='w-full'
                              onKeyDown={blockLetters}
                            />
                          </Form.Item>
                          <Form.Item
                            label={<AuthFieldLabel>{t('bodyType')}</AuthFieldLabel>}
                            name='vehicleTypeId'
                          >
                            <VehicleTypeSelect />
                          </Form.Item>
                        </div>
                      );
                    }

                    if (derived.type === 'traveler') {
                      return (
                        <div className='mt-2 grid gap-4 sm:grid-cols-2'>
                          <Form.Item
                            label={<AuthFieldLabel>{t('bodyCount')}</AuthFieldLabel>}
                            name='bodyCount'
                          >
                            <InputNumber
                              size='large'
                              min={1}
                              className='w-full'
                            />
                          </Form.Item>
                          <Form.Item
                            label={<AuthFieldLabel>{t('bodyType')}</AuthFieldLabel>}
                            name='vehicleTypeId'
                          >
                            <VehicleTypeSelect />
                          </Form.Item>
                        </div>
                      );
                    }

                    if (derived.type === 'load') {
                      return (
                        <div className='mt-2 grid gap-4 sm:grid-cols-2'>
                          <Form.Item
                            label={<AuthFieldLabel>{t('weightTons')}</AuthFieldLabel>}
                            name='weight_tons'
                          >
                            <InputNumber
                              size='large'
                              min={0}
                              step={0.01}
                              placeholder='0.00'
                              className='w-full'
                              onKeyDown={blockLetters}
                            />
                          </Form.Item>
                          <Form.Item
                            label={<AuthFieldLabel>{t('bodyType')}</AuthFieldLabel>}
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
                    <Space.Compact className='create-listing-price-wrap w-full'>
                      <InputNumber
                        size='large'
                        min={0}
                        placeholder={t('placeholderPriceFlexible')}
                        className='w-full create-listing-price-input'
                      />
                      {
                        <Form.Item name='currency' noStyle>
                          <Select
                            variant='filled'
                            popupMatchSelectWidth={false}
                            options={CURRENCIES.map((c) => ({
                              value: c,
                              label: t(c),
                            }))}
                            className='min-w-[4.5rem] create-listing-currency-select'
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

                <div className='flex items-center gap-3 mb-4'>
                  <Form.Item
                    name='isActive'
                    valuePropName='checked'
                    noStyle
                  >
                    <Switch />
                  </Form.Item>
                  <AuthFieldLabel>{tc('active')}</AuthFieldLabel>
                </div>

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
                      prefix='+993'
                      type='tel'
                      size='large'
                      placeholder='6X XXXXXX'
                      className='create-listing-phone-input'
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
                  loading={editMutation.isPending}
                  className='auth-split-primary-btn mt-4'
                >
                  {tc('save')}
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
