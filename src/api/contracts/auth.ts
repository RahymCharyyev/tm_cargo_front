import {initContract} from '@ts-rest/core';
import {
  isPhoneVerified,
  isPhoneVerifiedRes,
  loginDto,
  loginPhoneDto,
  loginResDto,
  meData,
  registerByPhoneDto,
  registerEmailDto,
  registerPhoneDto,
  registerPhoneRes,
  registerResDto,
  registerVerifyDto,
  resetPasswordDto,
  resetPasswordPhoneDto,
  resetPasswordPhoneVerifyDto,
  resetPasswordVerifyDto,
  verifyPhone,
} from '../dto/auth';
import {result} from '../dto/common';

const c = initContract();

export const authContract = c.router(
  {
    login: {
      method: 'POST',
      path: '/login',
      responses: {201: loginResDto},
      body: loginDto,
      summary: 'login user',
    },
    loginPhone: {
      method: 'POST',
      path: '/login/phone',
      body: loginPhoneDto,
      responses: {201: loginResDto},
      summary: 'login user by phone',
    },

    register: {
      method: 'POST',
      path: '/register',
      body: registerEmailDto,
      responses: {201: registerResDto},
      summary: 'register user',
    },
    registerVerify: {
      method: 'POST',
      path: '/register/verify',
      body: registerVerifyDto,
      responses: {201: loginResDto},
      summary: 'verify registration of user',
    },

    isPhoneRegisterable: {
      method: 'POST',
      path: '/phone-registerable',
      body: registerPhoneDto,
      responses: {201: registerPhoneRes},
    },
    isPhoneVerified: {
      method: 'POST',
      path: '/phone-verified',
      body: isPhoneVerified,
      responses: {201: isPhoneVerifiedRes},
    },
    registerByPhone: {
      method: 'POST',
      path: '/phone-register',
      body: registerByPhoneDto,
      responses: {201: loginResDto},
    },

    verifyPhone: {
      method: 'POST',
      path: '/phone-verify',
      body: verifyPhone,
      responses: {201: result},
    },

    resetPassword: {
      method: 'POST',
      path: '/reset-password',
      body: resetPasswordDto,
      responses: {201: registerResDto},
    },
    resetPasswordVerify: {
      method: 'POST',
      path: '/reset-password/verify',
      body: resetPasswordVerifyDto,
      responses: {201: result},
    },

    resetPasswordPhoneStart: {
      method: 'POST',
      path: '/reset-password/phone-start',
      body: resetPasswordPhoneDto,
      responses: {201: registerPhoneRes},
    },
    isResetPasswordPhoneVerified: {
      method: 'POST',
      path: '/reset-password/phone-verified',
      body: isPhoneVerified,
      responses: {201: isPhoneVerifiedRes},
    },
    resetPasswordPhone: {
      method: 'POST',
      path: '/reset-password/phone',
      body: resetPasswordPhoneVerifyDto,
      responses: {201: loginResDto},
    },

    otpPhone: {
      method: 'GET',
      path: '/otp-phone',
      responses: {200: registerPhoneRes},
    },

    me: {
      method: 'GET',
      path: '/me',
      responses: {200: meData},
    },
    logout: {
      method: 'GET',
      path: '/logout',
      responses: {200: result},
    },
  },
  {
    pathPrefix: '/auth',
  },
);
