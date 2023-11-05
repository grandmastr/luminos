import Vue from 'vue';
import Vuex from 'vuex';

import {
  monkeyboard,
  pool,
  swaps,
  theme,
  user,
  wallets,
} from '@/store/modules';

Vue.use(Vuex);

if (process.env.NODE_ENV === 'development') {
  Vue.config.devtools = true;
}

export default new Vuex.Store({
  modules: {
    user,
    wallets,
    swaps,
    monkeyboard,
    pool,
    theme,
  },
});
