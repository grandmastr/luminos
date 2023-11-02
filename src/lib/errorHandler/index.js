import toast from 'vue-m-message';

import { capitalize } from '@/helpers';

const handleError = response => {
  let errorMessage = '';

  if (response) {
    const data = response.data;

    if (typeof data !== 'object') {
      errorMessage = 'An error occurred, please try again';
    } else {
      for (const error of Object.values(data)) {
        errorMessage = `${errorMessage}${
          // eslint-disable-next-line no-void
          error !== null || error !== void 0 ? `${error}` : ''
        }`;
      }
    }

    toast.error(capitalize(errorMessage));
  }
};

export default handleError;
