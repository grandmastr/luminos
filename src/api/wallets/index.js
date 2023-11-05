import { errorHandler, server } from '@/lib';
import toast from 'vue-m-message';
import { unshiftArray } from '@/helpers';

export default {
  async fetchWallets() {
    try {
      const { status, data: response } = await server.get(
        '/api/wallets/crypto/',
      );

      if (status === 200) {
        return {
          success: true,
          response: unshiftArray(response.results, 'currency', 'NGN'),
        };
      }
    } catch ({ response }) {
      errorHandler(response);
    }
  },
  async getFiatWallets() {
    try {
      const { status, data: response } = await server.get('/api/wallets/fiat/');

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
  async createAddress({ asset, network }) {
    try {
      const { status, data: response } = await server.post(
        '/api/wallets/crypto/',
        {
          asset,
          network,
        },
      );

      if (status === 200) {
        return {
          success: true,
          response,
        };
      }
    } catch ({ response }) {
      errorHandler(response);
    }
  },
  async getFee(coin) {
    try {
      const { status, data: response } = await server.get(
        `/crypto/send/${coin}/fee/`,
      );

      if (status === 200 && response.data) {
        return {
          success: true,
          response,
        };
      } else
        return {
          success: false,
        };
    } catch ({ response }) {
      errorHandler(response);
    }
  },
  async getTransactionProviders({ swapRequestRef }) {
    try {
      const { status, data: response } = await server.get(
        `/swaps/instant_swaps/?swap_request_ref=${swapRequestRef}`,
      );

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
  async cancelTransaction({ swapRequestRef }) {
    try {
      const { status, data: response } = await server.delete(
        `/swaps/instant_swaps/?swap_request_ref=${swapRequestRef}`,
      );

      if (status === 204) {
        return {
          success: true,
          response,
        };
      }
    } catch ({ response }) {
      errorHandler(response);
    }
  },
  async sendCrypto({ currency, amount, address, fee }) {
    try {
      const { status, data: response } = await server.post('/crypto/send/', {
        currency,
        amount,
        address,
        fee,
      });

      if (status === 200 && response.success) {
        toast.success('Transaction successful');

        return {
          success: true,
          response,
        };
      } else {
        toast.error(
          "Transaction can't be processed at this time, please try again",
        );
      }
    } catch ({ response }) {
      errorHandler(response);
    }
  },
};
