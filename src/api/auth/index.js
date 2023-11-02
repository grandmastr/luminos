import toast from 'vue-m-message';

import { errorHandler, server } from '@/lib';

export default {
  async signUp({
    email,
    password,
    countryCode,
    swapTag,
    accountType = 'SWAPPER',
    name,
  }) {
    try {
      const { status, data: response } = await server.post(
        '/authentication/flux/signup/',
        {
          email,
          password,
          country_code: countryCode,
          account_type: accountType,
          name,
          swap_tag: swapTag,
        },
      );

      if (status === 201) {
        sessionStorage.clear();
        toast.success('Welcome to the jungle');

        return {
          success: true,
          response,
        };
      }
    } catch ({ response }) {
      errorHandler(response);
    }
  },
  async changePassword() {
    try {
      //
    } catch ({ response }) {
      errorHandler(response);
    }
  },
};
