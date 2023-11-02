import toast from 'vue-m-message';

import { errorHandler, server } from '@/lib';

export default {
  async get() {
    try {
      const { status, data: response } = await server.get('/users/');

      if (status === 200) {
        localStorage.setItem('bravo-zulu', JSON.stringify(response));

        return {
          success: true,
          response,
        };
      }
    } catch ({ response }) {
      errorHandler(response);
    }
  },
  async update(body, message = 'Profile update successful') {
    try {
      const { status, data: response } = await server.put('/users/', body);

      if (status === 200) {
        toast.success(message);

        return {
          success: true,
          response,
        };
      }
    } catch ({ response }) {
      errorHandler(response);
    }
  },
  async changePassword({ oldPassword, newPassword1, newPassword2 }) {
    try {
      const { status, data: response } = await server.post(
        'https://beta-api.fluxapi.co.uk/auth/password/change/',
        {
          old_password: oldPassword,
          new_password1: newPassword1,
          new_password2: newPassword2,
        },
      );

      if (status === 200) {
        toast.success(response.detail);

        return {
          success: true,
          response,
        };
      }
    } catch ({ response }) {
      errorHandler(response);
    }
  },
  async verify({ action = 'VERIFY', code }) {
    try {
      const { status, data: response } = await server.post('/users/verify/', {
        action,
        code,
      });

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
};
