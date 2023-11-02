import toast from 'vue-m-message';

import { errorHandler, server } from '@/lib';

export default {
  async become({ amount }) {
    try {
      const { status, data: response } = await server.post(
        '/users/pool_provider/',
        {
          amount: amount * 100,
        },
      );

      if (status === 200) {
        toast.success('Awesome, you are now a pool provider');

        return { success: true, response };
      }
    } catch ({ response }) {
      errorHandler(response);
    }
  },
  async fetch() {
    try {
      const { status, data: response } = await server.get('/crypto/pools/');

      if (status === 200) {
        return {
          success: true,
          response: response.results,
        };
      }
    } catch ({ response }) {
      errorHandler(response);
    }
  },
};
