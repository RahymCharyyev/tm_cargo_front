import {initContract} from '@ts-rest/core';
import {result} from '../dto/common';
import {listingVerifyPhoneDto} from '../dto/listing-otp';

const c = initContract();

export const listingOtpContract = c.router(
  {
    verify: {
      method: 'POST',
      path: '/verify',
      body: listingVerifyPhoneDto,
      responses: {201: result},
    },
  },
  {
    pathPrefix: '/listing-otp',
  },
);
