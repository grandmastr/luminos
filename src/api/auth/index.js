import toast from 'vue-m-message';

import { errorHandler, server } from '@/lib';

export default {
  async signIn({ email, password }) {
    try {
      const { status, data: response } = await server.post('/api/auth/login/', {
        email,
        password,
      });

      if (status === 200) {
        sessionStorage.clear();
        toast.success('Welcome to the light');

        return {
          success: true,
          response,
        };
      }
    } catch ({ response }) {
      errorHandler(response);
    }
  },
  async signUp({ email, password }) {
    try {
      const { status, data: response } = await server.post(
        '/api/auth/register/',
        {
          email,
          password1: password,
          password2: password,
        },
      );

      if (status === 201) {
        sessionStorage.clear();
        toast.success('Welcome to the light!');

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
