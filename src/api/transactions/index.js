import { errorHandler, server } from '@/lib';

export default {
  async getList() {
    try {
      const { status, data: response } = await server.get('/api/transactions/');

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
