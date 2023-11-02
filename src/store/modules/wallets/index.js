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
      const data = await wallets.fetchWallets();

      if (data?.success) {
        commit('setWallets', {
          fetching: false,
          results: data.response,
        });

        return {
          ...data,
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
