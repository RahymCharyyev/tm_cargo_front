'use client';

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@/i18n/navigation';
import { api } from './api-client';
import { useAuthStore } from './auth-store';

// ─── Types ──────────────────────────────────────────────
// Inferred from DTOs — using plain TS interfaces for runtime

interface Names {
  en: string;
  ru: string;
  tk: string;
}

export interface LocationData {
  id: string;
  names: Names;
  icon?: string | null;
  level: number;
  isoCode?: string | null;
  parentId?: string | null;
  parent?: LocationData | null;
  createdAt: string;
  hasChild?: boolean;
  keywords?: string[];
}

export interface VehicleType {
  id: string;
  names: Names;
  icon?: string | null;
  isSpecial: boolean;
  createdAt: string;
}

export interface ListingImage {
  id: string;
  filename: string;
}

export interface ListingOwner {
  id: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
}

export interface ListingExtra {
  from?: {
    names: Names;
    icon?: string | null;
    parentIcon?: string | null;
    parentNames?: Names | null;
    countryNames?: Names | null;
  } | null;
  to?: {
    names: Names;
    icon?: string | null;
    parentIcon?: string | null;
    parentNames?: Names | null;
    countryNames?: Names | null;
  } | null;
  cargo?: {
    vehicleTypeId?: string | null;
    volume_m3?: number | null;
    weight_kg?: number | null;
    vehicleType?: { names: Names; icon?: string | null; isSpecial: boolean } | null;
  } | null;
  vehicle?: {
    vehicleTypeId?: string | null;
    volume_m3?: number | null;
    weight_kg?: number | null;
    vehicleType?: { names: Names; icon?: string | null; isSpecial: boolean } | null;
  } | null;
  traveler?: {
    travelerType: 'vehicle' | 'person';
    bodyCount: number;
    vehicleTypeId?: string | null;
    vehicleType?: { names: Names; icon?: string | null; isSpecial: boolean } | null;
  } | null;
  load?: {
    loadType: 'vehicle' | 'load';
    weight_kg: number;
    vehicleTypeId?: string | null;
    vehicleType?: { names: Names; icon?: string | null; isSpecial: boolean } | null;
  } | null;
  owner?: ListingOwner | null;
  images?: ListingImage[] | null;
}

export interface Listing extends ListingExtra {
  id: string;
  userId: string;
  title: string;
  type: 'cargo' | 'vehicle' | 'traveler' | 'load';
  viewCount: number;
  price: number | null;
  currency: 'manat' | 'dollar' | 'euro' | null;
  fromLocationId: string;
  toLocationId: string;
  isActive: boolean;
  locationType: 'international' | 'intercity' | 'local';
  description?: string | null;
  phone?: string | null;
  phoneVerified?: boolean | null;
  email?: string | null;
  dueDate?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  isFavorite?: boolean | null;
}

export interface ListingsResponse {
  count: number;
  data: Listing[];
}

export interface ListingQuery {
  page?: number;
  perPage?: number;
  type?: string;
  locationType?: string;
  fromLocationId?: string;
  toLocationId?: string;
  sortBy?: string;
  sortDirection?: string;
  my?: string;
  vehicleTypeId?: string;
  isActive?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface BannerData {
  id: string;
  link: string | null;
  image: string;
  dueDate: string | null;
  location: 'top' | 'inside' | 'list' | 'sidebar';
  order: number;
  isActive: boolean;
  createdAt: string;
}

export interface SettingData {
  id: string;
  key: string;
  value: string;
}

export interface FavoriteData {
  listingId: string;
  userId: string;
  listing?: Listing | null;
}

// ─── Auth Hooks ─────────────────────────────────────────

interface LoginPayload {
  email?: string;
  phone?: string;
  password: string;
}

interface RegisterEmailPayload {
  email: string;
}

interface RegisterVerifyPayload {
  email: string;
  otp: string;
  fullName: string;
  password: string;
}

interface RegisterPhonePayload {
  phone: string;
}

interface RegisterByPhonePayload {
  phone: string;
  fullName: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    role: 'admin' | 'member';
    fullName: string | null;
    email: string | null;
    phone: string | null;
  };
  token: string;
}

interface RegisterResponse {
  success: boolean;
  otp?: string | number;
}

interface PhoneResponse {
  phone: string;
}

interface PhoneVerifiedResponse {
  token: string;
}

export function useLogin() {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async (data: LoginPayload) => {
      if (data.phone) {
        return api.post<LoginResponse>('/auth/login/phone', {
          phone: data.phone,
          password: data.password,
        });
      }
      return api.post<LoginResponse>('/auth/login', {
        email: data.email,
        password: data.password,
      });
    },
    onSuccess: (res) => {
      login(res.user, res.token);
    },
  });
}

export function useRegisterEmail() {
  return useMutation({
    mutationFn: (data: RegisterEmailPayload) =>
      api.post<RegisterResponse>('/auth/register', data),
  });
}

export function useRegisterVerify() {
  const { login } = useAuthStore();
  return useMutation({
    mutationFn: (data: RegisterVerifyPayload) =>
      api.post<LoginResponse>('/auth/register/verify', data),
    onSuccess: (res) => {
      login(res.user, res.token);
    },
  });
}

export function useIsPhoneRegisterable() {
  return useMutation({
    mutationFn: (data: RegisterPhonePayload) =>
      api.post<PhoneResponse>('/auth/phone-registerable', data),
  });
}

export function useIsPhoneVerified() {
  return useMutation({
    mutationFn: (data: { phone: string }) =>
      api.post<PhoneVerifiedResponse>('/auth/phone-verified', data),
  });
}

export function useRegisterByPhone() {
  const { login } = useAuthStore();
  return useMutation({
    mutationFn: (data: RegisterByPhonePayload) =>
      api.post<LoginResponse>('/auth/phone-register', data),
    onSuccess: (res) => {
      login(res.user, res.token);
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      api.post<RegisterResponse>('/auth/reset-password', data),
  });
}

export function useResetPasswordVerify() {
  return useMutation({
    mutationFn: (data: { email: string; otp: string; password: string }) =>
      api.post<{ success: boolean }>('/auth/reset-password/verify', data),
  });
}

export function useResetPasswordPhoneStart() {
  return useMutation({
    mutationFn: (data: { phone: string }) =>
      api.post<PhoneResponse>('/auth/reset-password/phone-start', data),
  });
}

export function useResetPasswordPhone() {
  const { login } = useAuthStore();
  return useMutation({
    mutationFn: (data: { phone: string; password: string }) =>
      api.post<LoginResponse>('/auth/reset-password/phone', data),
    onSuccess: (res) => {
      login(res.user, res.token);
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => api.get<{ success: boolean }>('/auth/logout'),
    onSettled: () => {
      logout();
      queryClient.clear();
      router.push('/');
    },
  });
}

export function useDeleteAccount() {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.delete<{ success: boolean }>('/users/'),
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });
}

// ─── Listings Hooks ─────────────────────────────────────

export function useListings(query: ListingQuery) {
  return useQuery({
    queryKey: ['listings', query],
    queryFn: () =>
      api.get<ListingsResponse>('/listings', query as Record<string, string | number | boolean | undefined>),
  });
}

const LISTINGS_PER_PAGE = 12;

export function useInfiniteListings(query: Omit<ListingQuery, 'page' | 'perPage'>) {
  return useInfiniteQuery({
    queryKey: ['listings-infinite', query],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      api.get<ListingsResponse>('/listings', {
        ...(query as Record<string, string | number | boolean | undefined>),
        page: pageParam as number,
        perPage: LISTINGS_PER_PAGE,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.length * LISTINGS_PER_PAGE;
      return loaded < lastPage.count ? allPages.length + 1 : undefined;
    },
  });
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: () => api.get<Listing>(`/listings/${id}`),
    enabled: !!id,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post<{ success: boolean; id: string }>('/listings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useEditListing(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.put<{ success: boolean }>(`/listings/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['listing', id] });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<{ success: boolean }>(`/listings/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

// ─── Listing Images ─────────────────────────────────────

export function useListingImages(listingId: string) {
  return useQuery({
    queryKey: ['listing-images', listingId],
    queryFn: () =>
      api.get<{ count: number; data: { id: string; listingId: string; filename: string; createdAt: string }[] }>(
        '/listing-images',
        { listingId },
      ),
    enabled: !!listingId,
  });
}

export function useUploadListingImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { listingId: string; image: File }) => {
      const formData = new FormData();
      formData.append('listingId', data.listingId);
      formData.append('image', data.image);
      return api.post<{ success: boolean }>('/listing-images', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listing-images'] });
    },
  });
}

export function useDeleteListingImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<{ success: boolean }>(`/listing-images/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listing-images'] });
    },
  });
}

// ─── Listing OTP ────────────────────────────────────────

export function useVerifyListingPhone() {
  return useMutation({
    mutationFn: (data: { phone: string }) =>
      api.post<{ success: boolean }>('/listing-otp/verify', data),
  });
}

// ─── Locations Hooks ────────────────────────────────────

export function useLocations(query?: { parentId?: string; name?: string; level?: number; page?: number; perPage?: number }) {
  return useQuery({
    queryKey: ['locations', query],
    queryFn: () =>
      api.get<{ count: number; data: LocationData[] }>('/locations', query as Record<string, string | number | boolean | undefined>),
  });
}

// ─── Vehicle Types Hooks ────────────────────────────────

export function useVehicleTypes(query?: { name?: string; page?: number; perPage?: number }) {
  return useQuery({
    queryKey: ['vehicle-types', query],
    queryFn: () =>
      api.get<{ count: number; data: VehicleType[] }>('/vehicle-types', query as Record<string, string | number | boolean | undefined>),
  });
}

// ─── Banners Hooks ──────────────────────────────────────

export function useBanners(query?: {
  location?: string;
  type?: 'desktop' | 'mobile';
  isActive?: string;
  page?: number;
  perPage?: number;
}) {
  return useQuery({
    queryKey: ['banners', query],
    queryFn: () =>
      api.get<{ count: number; data: BannerData[] }>('/banners', query as Record<string, string | number | boolean | undefined>),
  });
}

// ─── Favorites Hooks ────────────────────────────────────

export function useFavorites(query?: { page?: number; perPage?: number }) {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['favorites', query],
    queryFn: () =>
      api.get<{ count: number; data: FavoriteData[] }>('/listing-favorites', query as Record<string, string | number | boolean | undefined>),
    enabled: isAuthenticated,
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listingId: string) =>
      api.post<{ success: boolean }>('/listing-favorites', { listingId }),
    onSuccess: (_data, listingId) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['listings-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['listing', listingId] });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete<{ success: boolean }>(`/listing-favorites/${id}`),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['listings-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['listing', id] });
    },
  });
}

// ─── Settings Hooks ─────────────────────────────────────

export function useSettings(query?: { key?: string; page?: number; perPage?: number }) {
  return useQuery({
    queryKey: ['settings', query],
    queryFn: () =>
      api.get<{ count: number; data: SettingData[] }>('/settings', query as Record<string, string | number | boolean | undefined>),
  });
}
