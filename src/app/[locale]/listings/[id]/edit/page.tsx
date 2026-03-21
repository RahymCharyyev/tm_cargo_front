'use client';

import {
  Alert,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  Upload,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import dayjs from 'dayjs';
import { use, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useListing, useEditListing, useUploadListingImage } from '@/lib/hooks';
import { useRouter } from '@/i18n/navigation';
import LocationSelect from '@/components/LocationSelect';
import VehicleTypeSelect from '@/components/VehicleTypeSelect';
import LoadingSpinner from '@/components/LoadingSpinner';
import Image from 'next/image';

const TYPES = ['cargo', 'vehicle', 'traveler', 'load'] as const;
const LOCATION_TYPES = ['international', 'intercity', 'local'] as const;
const CURRENCIES = ['manat', 'dollar', 'euro'] as const;

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations('listing');
  const tc = useTranslations('common');
  const router = useRouter();
  const { data: listing, isLoading } = useListing(id);
  const editMutation = useEditListing(id);
  const uploadImage = useUploadListingImage();
  const [form] = Form.useForm();
  const [error, setError] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (listing && !initialized) {
      setInitialized(true);
      form.setFieldsValue({
        title: listing.title,
        type: listing.type,
        locationType: listing.locationType,
        fromLocationId: listing.fromLocationId,
        toLocationId: listing.toLocationId,
        price: listing.price ?? undefined,
        currency: listing.currency || 'manat',
        description: listing.description || '',
        phone: listing.phone || '',
        email: listing.email || '',
        dueDate: listing.dueDate ? dayjs(listing.dueDate) : undefined,
        weight_kg:
          listing.cargo?.weight_kg ??
          listing.vehicle?.weight_kg ??
          listing.load?.weight_kg ??
          undefined,
        volume_m3: listing.cargo?.volume_m3 ?? listing.vehicle?.volume_m3 ?? undefined,
        vehicleTypeId:
          listing.cargo?.vehicleTypeId ||
          listing.vehicle?.vehicleTypeId ||
          listing.traveler?.vehicleTypeId ||
          listing.load?.vehicleTypeId ||
          undefined,
        travelerType: listing.traveler?.travelerType || 'person',
        bodyCount: listing.traveler?.bodyCount ?? 1,
        loadType: listing.load?.loadType || 'load',
        isActive: listing.isActive,
      });
    }
  }, [listing, initialized, form]);

  if (isLoading) return <LoadingSpinner />;

  const handleSubmit = async (values: Record<string, unknown>) => {
    setError('');

    const body: Record<string, unknown> = {
      title: values.title,
      type: values.type,
      locationType: values.locationType,
      fromLocationId: values.fromLocationId,
      toLocationId: values.toLocationId,
      description: values.description || undefined,
      phone: values.phone || undefined,
      email: values.email || undefined,
      price: values.price ? Number(values.price) : undefined,
      currency: values.price ? values.currency : undefined,
      dueDate: values.dueDate ? dayjs(values.dueDate as dayjs.Dayjs).format('YYYY-MM-DD') : undefined,
      isActive: values.isActive,
    };

    const type = values.type as string;
    if (type === 'cargo' || type === 'vehicle') {
      body.weight_kg = values.weight_kg ? Number(values.weight_kg) : undefined;
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
      body.weight_kg = values.weight_kg ? Number(values.weight_kg) : undefined;
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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('editTitle')}</h1>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Card className="mb-6 !rounded-2xl !border-gray-100 !shadow-sm">
          <Form.Item label={`${t('title')} *`} name="title" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>

          <Form.Item label={`${t('type')} *`} name="type" rules={[{ required: true }]}>
            <Radio.Group>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TYPES.map((type) => (
                  <Radio.Button key={type} value={type} style={{ borderRadius: 12 }} className="!text-center !rounded-xl">
                    {t(type)}
                  </Radio.Button>
                ))}
              </div>
            </Radio.Group>
          </Form.Item>

          <Form.Item label={`${t('locationType')} *`} name="locationType" rules={[{ required: true }]}>
            <Radio.Group>
              <div className="grid grid-cols-3 gap-2">
                {LOCATION_TYPES.map((lt) => (
                  <Radio.Button key={lt} value={lt} style={{ borderRadius: 12 }} className="!text-center !rounded-xl">
                    {t(lt)}
                  </Radio.Button>
                ))}
              </div>
            </Radio.Group>
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label={`${t('fromLocation')} *`} name="fromLocationId" rules={[{ required: true }]}>
              <LocationSelect
                value={form.getFieldValue('fromLocationId') ?? ''}
                onChange={(id) => form.setFieldValue('fromLocationId', id)}
              />
            </Form.Item>
            <Form.Item label={`${t('toLocation')} *`} name="toLocationId" rules={[{ required: true }]}>
              <LocationSelect
                value={form.getFieldValue('toLocationId') ?? ''}
                onChange={(id) => form.setFieldValue('toLocationId', id)}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Form.Item label={tc('price')} name="price">
                <InputNumber style={{ width: '100%' }} size="large" min={0} />
              </Form.Item>
            </div>
            <div>
              <Form.Item label={t('currency')} name="currency">
                <Select size="large" options={CURRENCIES.map((c) => ({ value: c, label: t(c) }))} />
              </Form.Item>
            </div>
          </div>

          <Form.Item label={tc('description')} name="description">
            <Input.TextArea rows={4} size="large" />
          </Form.Item>

          <Form.Item label={t('dueDate')} name="dueDate">
            <DatePicker style={{ width: '100%' }} size="large" format="DD.MM.YYYY" />
          </Form.Item>

          <Form.Item label={tc('active')} name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Card>

        {/* Type-specific */}
        <Form.Item noStyle shouldUpdate={(prev, cur) => prev.type !== cur.type}>
          {({ getFieldValue }) => {
            const type = getFieldValue('type');
            if (type === 'cargo' || type === 'vehicle') {
              return (
                <Card className="mb-6 !rounded-2xl !border-gray-100 !shadow-sm">
                  <h2 className="font-semibold text-gray-900 mb-4">{t(type)}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Form.Item label={t('weight')} name="weight_kg">
                      <InputNumber style={{ width: '100%' }} size="large" min={0} />
                    </Form.Item>
                    <Form.Item label={t('volume')} name="volume_m3">
                      <InputNumber style={{ width: '100%' }} size="large" min={0} />
                    </Form.Item>
                  </div>
                  <Form.Item label={t('vehicleType')} name="vehicleTypeId">
                    <VehicleTypeSelect
                      value={form.getFieldValue('vehicleTypeId') ?? ''}
                      onChange={(id) => form.setFieldValue('vehicleTypeId', id)}
                    />
                  </Form.Item>
                </Card>
              );
            }
            if (type === 'traveler') {
              return (
                <Card className="mb-6 !rounded-2xl !border-gray-100 !shadow-sm">
                  <h2 className="font-semibold text-gray-900 mb-4">{t('traveler')}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Form.Item label={t('travelerType')} name="travelerType">
                      <Select
                        size="large"
                        options={[
                          { value: 'person', label: t('person') },
                          { value: 'vehicle', label: t('vehicle') },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item label={t('bodyCount')} name="bodyCount">
                      <InputNumber style={{ width: '100%' }} size="large" min={1} />
                    </Form.Item>
                  </div>
                </Card>
              );
            }
            if (type === 'load') {
              return (
                <Card className="mb-6 !rounded-2xl !border-gray-100 !shadow-sm">
                  <h2 className="font-semibold text-gray-900 mb-4">{t('load')}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Form.Item label={t('loadType')} name="loadType">
                      <Select
                        size="large"
                        options={[
                          { value: 'load', label: t('load') },
                          { value: 'vehicle', label: t('vehicle') },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item label={t('weight')} name="weight_kg">
                      <InputNumber style={{ width: '100%' }} size="large" min={0} />
                    </Form.Item>
                  </div>
                </Card>
              );
            }
            return null;
          }}
        </Form.Item>

        {/* Contact Info */}
        <Card className="mb-6 !rounded-2xl !border-gray-100 !shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">{t('contactInfo')}</h2>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label={tc('phone')} name="phone">
              <Input type="tel" size="large" />
            </Form.Item>
            <Form.Item label={tc('email')} name="email">
              <Input type="email" size="large" />
            </Form.Item>
          </div>
        </Card>

        {/* Images */}
        <Card className="mb-6 !rounded-2xl !border-gray-100 !shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">{t('images')}</h2>
          {listing?.images && listing.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {listing.images.map((img) => (
                <Image
                  key={img.id}
                  src={`https://tm-cargo.com.tm/api/${img.filename}`}
                  alt=""
                  width={100}
                  height={100}
                  crossOrigin="anonymous"
                  className="w-full h-24 object-cover rounded-xl"
                />
              ))}
            </div>
          )}
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList: newList }) => setFileList(newList)}
            beforeUpload={() => false}
            accept="image/*"
            multiple
          >
            {fileList.length < 10 && (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>{tc('upload') || 'Upload'}</div>
              </div>
            )}
          </Upload>
        </Card>

        {error && <Alert type="error" message={error} showIcon className="mb-6" />}

        <div className="flex gap-4">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={editMutation.isPending}
            style={{
              flex: 1,
              background: 'linear-gradient(to right, #3D7EF9, #2B529B)',
              border: 'none',
              borderRadius: 12,
              height: 48,
              fontWeight: 500,
            }}
          >
            {tc('save')}
          </Button>
          <Button
            size="large"
            onClick={() => router.back()}
            style={{ paddingInline: 32, borderRadius: 12, height: 48 }}
          >
            {tc('cancel')}
          </Button>
        </div>
      </Form>
    </div>
  );
}
