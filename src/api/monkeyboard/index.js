import { errorHandler, server } from '@/lib';

export default {
  async get() {
    try {
      const { status, data: response } = await server('/users/leaderboard/');

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
