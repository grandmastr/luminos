import { errorHandler, server } from '@/lib';

export default {
  async createRequest({ amount, have, want, swapQuote, instant }) {
    try {
      const { status, data: response } = await server.post('/swaps/requests/', {
        amount: have === 'NGN' ? amount * 100 : amount,
        have,
        want,
        swap_quote: swapQuote,
        instant,
      });

      if (status === 201) {
        return {
          success: true,
          response,
        };
      }
    } catch ({ response }) {
      if (response.status === 400 && response.data.swap_quote) {
        const data = await this.getQuote({ have, want, amount, instant });

        if (data?.success) {
          await this.createRequest({
            amount,
            have,
            want,
            swapQuote: data?.response.id,
            instant,
          });
        }
      } else errorHandler(response);
    }
  },
  async fetchSwaps() {
    try {
      const { status, data: response } = await server.get('/swaps/requests/');

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
  async getQuote({ have, want, amount, instant = false }) {
    try {
      const { status, data: response } = await server.post('/swaps/quote/', {
        have,
        want,
        amount: have === 'NGN' ? amount * 100 : amount,
        instant,
      });

      if (status === 201) {
        return {
          success: true,
          response,
        };
      }
    } catch ({ response }) {
      errorHandler(response);
    }
  },
};
