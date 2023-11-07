import { errorHandler, server } from '@/lib';

export default {
  async createRequest({ sendNetwork, receiveNetwork, swapQuote }) {
    try {
      const { status, data: response } = await server.post(
        '/api/crypto/swap_quote_confirm/',
        {
          send_network: sendNetwork,
          receive_network: receiveNetwork,
          quote_id: swapQuote,
        },
      );
      if (status === 201) {
        return {
          success: true,
          response,
        };
      }
    } catch ({ response }) {
      if (response.status === 400 && response.data.swap_quote) {
        const data = await this.getQuote({});

        if (data?.success) {
          await this.createRequest({
            swapQuote: data?.response.id,
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
  async getQuote({ sendCurrency, receiveCurrency, sendAmount, receiveAmount }) {
    try {
      let body = {
        send_currency: sendCurrency,
        receive_currency: receiveCurrency,
      };

      if (sendAmount) {
        body = {
          ...body,
          send_amount: sendAmount,
        };
      } else {
        body = {
          ...body,
          receive_amount: receiveAmount,
        };
      }

      const { status, data: response } = await server.post(
        '/api/crypto/swap_quote/',
        {
          ...body,
        },
      );

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
