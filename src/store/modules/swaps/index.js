import Vue from 'vue';

import { swap } from '@/api';

const state = () => ({
  fetching: false,
  results: [],
});

const getters = {
  swaps: state => state,
};

const actions = {
  async fetchSwaps({ commit, getters }) {
    commit('setSwaps', {
      fetching: true,
      results: getters.swaps.results,
    });
    try {
      const data = await swap.fetchSwaps();

      if (data?.success) {
        commit('setSwaps', {
          fetching: false,
          results: data.response,
        });
      }
    } finally {
      commit('setSwaps', {
        fetching: false,
        results: getters.swaps.results,
      });
    }
  },
};

const mutations = {
  setSwaps(state, { fetching, results }) {
    Vue.set(state, 'fetching', fetching);
    Vue.set(state, 'results', results);
  },
};

export default { namespaced: true, state, getters, actions, mutations };
