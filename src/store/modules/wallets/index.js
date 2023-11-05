import Vue from 'vue';
import { wallets } from '@/api';

const state = () => ({
  fetching: false,
  results: [],
  downTimeWarning: false,
});

const getters = {
  wallets: ({ fetching, results }) => ({
    fetching,
    results,
  }),
  downTimeWarning: ({ downTimeWarning }) => downTimeWarning,
};

const mutations = {
  setWallets(state, { fetching, results }) {
    Vue.set(state, 'fetching', fetching);
    Vue.set(state, 'results', results);
  },
  setDownTimeWarning(state, downTimeWarning) {
    Vue.set(state, 'downTimeWarning', downTimeWarning);
  },
};

const actions = {
  async fetchWallets({ commit, getters }) {
    commit('setWallets', {
      fetching: true,
      results: getters.wallets.results,
    });

    try {
      const getCrypto = async () => await wallets.fetchWallets();
      const getFiat = async () => await wallets.getFiatWallets();

      const [cryptoData, fiatData] = await Promise.all([
        getCrypto(),
        getFiat(),
      ]);

      if (cryptoData?.success && fiatData?.success) {
        commit('setWallets', {
          fetching: false,
          results: [...cryptoData.response, ...fiatData.response],
        });

        return {
          ...fiatData,
          ...cryptoData,
        };
      }
    } finally {
      commit('setWallets', {
        fetching: false,
        results: getters.wallets.results,
      });
    }
  },
};

export default {
  namespaced: true,
  actions,
  getters,
  state,
  mutations,
};
