import {z} from 'zod';
import {commonQuery, names, sortDirection, strBool, strNumber, uuidArr} from './common';
import {addCargo, cargoDto, cargoExtra, editCargo} from './listing-cargo';
import {listingImageDto} from './listing-image';
import {addLoad, editLoad, loadDto, loadExtra} from './listing-load';
import {addTraveler, editTraveler, travelerDto, travelerExtra} from './listing-traveler';
import {addVehicle, editVehicle, vehicleDto, vehicleExtra} from './listing-vehicle';
import {locationDto} from './location';
import {userDto} from './user';

export const listingDto = z.object({
  id: z.string().uuid(),

  userId: z.string().uuid(),
  title: z.string().max(255),
  type: z.enum(['cargo', 'vehicle', 'traveler', 'load']),
  viewCount: z.coerce.number().int(),
  price: strNumber.nullable(),
  currency: z.enum(['manat', 'dollar', 'euro']).nullable(),
  fromLocationId: z.string().uuid(),
  toLocationId: z.string().uuid(),
  isActive: strBool,
  locationType: z.enum(['international', 'intercity', 'local']),

  description: z.string().trim().nullish(),
  phone: z.string().trim().nullish(),
  phoneVerified: strBool.nullable(),
  email: z.string().trim().email().nullish(),

  dueDate: z.coerce.date().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullish(),
});

const types = z.string().transform((v) => {
  const types = v.split(',');
  return listingDto.shape.type.array().parse(types);
});


export const listingExtra = z.object({
  from: locationDto
    .pick({names: true, icon: true})
    .extend({parentIcon: z.string().nullish(), parentNames: names.nullish(), countryNames: names.nullish()})
    .nullish(),
  to: locationDto
    .pick({names: true, icon: true})
    .extend({parentIcon: z.string().nullish(), parentNames: names.nullish(), countryNames: names.nullish()})
    .nullish(),

  cargo: cargoDto.omit({listingId: true}).merge(cargoExtra).nullish(),
  vehicle: vehicleDto.omit({listingId: true}).merge(vehicleExtra).nullish(),
  traveler: travelerDto.omit({listingId: true}).merge(travelerExtra).nullish(),
  load: loadDto.omit({listingId: true}).merge(loadExtra).nullish(),

  owner: userDto.pick({id: true, fullName: true, email: true, phone: true}).nullish(),
  images: listingImageDto.pick({id: true, filename: true}).array().nullish(),
});

const isFavorite = z.coerce.boolean().nullish();

// const type = z.enum(['cargo', 'vehicle', 'traveler', 'load']);

// export const listing = z.discriminatedUnion('type', [
//   z.object({type: z.literal(type.Enum.cargo), data: cargoDto}).merge(listingDto),
//   z.object({type: z.literal(type.Enum.vehicle), data: vehicleDto}).merge(listingDto),
//   z.object({type: z.literal(type.Enum.traveler), data: travelerDto}).merge(listingDto),
//   z.object({type: z.literal(type.Enum.load), data: loadDto}).merge(listingDto),
// ]);

export type ListingDto = z.infer<typeof listingDto>;
export const listingFields = listingDto.keyof().options;

export const sortListingBy = listingDto
  .pick({price: true, viewCount: true, createdAt: true, updatedAt: true, dueDate: true})
  .extend({volume: z.coerce.number(), weight: z.coerce.number(), bodyCount: z.coerce.number()})
  .keyof();

const sort = z.object({sortBy: sortListingBy, sortDirection}).partial();
export type SortListing = z.infer<typeof sort>;

export const getListings = listingDto
  .omit({price: true})
  .merge(sort)
  .merge(travelerDto.pick({travelerType: true, bodyCount: true}))
  .merge(loadDto.pick({loadType: true}))
  .extend({
    vehicleTypeIds: uuidArr,
    vehicleTypeId: z.string().uuid(),
    my: strBool.default('false'),
    toWeight: z.coerce.number(),
    toVolume: z.coerce.number(),
    isRemoved: strBool,
    types: types,
  })
  .partial()
  .merge(commonQuery);
export const getListingsRes = z.object({
  count: z.number(),
  data: listingDto.extend({isFavorite}).merge(listingExtra).array(),
});

export type GetListings = z.infer<typeof getListings>;

export const addListing = listingDto
  .pick({
    title: true,
    description: true,
    type: true,
    locationType: true,
    price: true,
    currency: true,
    fromLocationId: true,
    toLocationId: true,
    dueDate: true,
    phone: true,
    email: true,
  })
  .extend({
    traveler: addTraveler.omit({listingId: true}).optional(),
    cargo: addCargo.omit({listingId: true}).optional(),
    vehicle: addVehicle.omit({listingId: true}).optional(),
    load: addLoad.omit({listingId: true}).optional(),
  })
  .partial({
    price: true,
    currency: true,
  });

export const getListingRes = listingDto.extend({isFavorite}).merge(listingExtra).nullish();

export const editListing = listingDto
  .pick({
    title: true,
    description: true,
    type: true,
    locationType: true,
    price: true,
    currency: true,
    fromLocationId: true,
    toLocationId: true,
    dueDate: true,
    isActive: true,
    phone: true,
    email: true,
  })
  .extend({
    traveler: editTraveler.optional(),
    cargo: editCargo.optional(),
    vehicle: editVehicle.optional(),
    load: editLoad.optional(),
  })
  .partial();
