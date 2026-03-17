import {initContract} from '@ts-rest/core';
import {authContract} from './auth';
import {adminBannerContract, bannerContract} from './banner';
import {adminListingContract, listingContract} from './listing';
import {listingFavoriteContract} from './listing-favorite';
import {listingImageAdminContract, listingImageContract} from './listing-image';
import {listingOtpContract} from './listing-otp';
import {adminLocationContract, locationContract} from './location';
import {adminSettingContract, settingContract} from './setting';
import {accountContract, adminUserContract} from './user';
import {adminVehicleTypeContract, vehicleTypeContract} from './vehicle-type';
import { adminContactContract, contactContract } from './contact';

const contract = initContract();

export const c = contract.router({
  auth: authContract,
  admin: contract.router(
    {
      banner: adminBannerContract,
      location: adminLocationContract,
      vehicleType: adminVehicleTypeContract,
      listing: adminListingContract,
      listingImage: listingImageAdminContract,
      user: adminUserContract,
      setting: adminSettingContract,
      contact: adminContactContract,
    },
    {pathPrefix: '/admin'},
  ),
  banner: bannerContract,
  location: locationContract,
  vehicleType: vehicleTypeContract,
  listing: listingContract,
  listingImage: listingImageContract,
  listingFavorite: listingFavoriteContract,
  listingOtp: listingOtpContract,
  account: accountContract,
  setting: settingContract,
  contact: contactContract,
});
