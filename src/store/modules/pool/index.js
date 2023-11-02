import Vue from 'vue';

import { pool } from '@/api';
import { symbolToAsset } from '@/helpers';

const state = () => ({
  fetching: false,
  results: [],
});

const getters = {
  pool: state => state,
  poolTotalStartBalance: state =>
    state.results.reduce((acc, val) => acc + val.start_amount / 100, 0) || 0,
  poolTotalCurrentBalance: state =>
    state.results.reduce((acc, val) => acc + val.current_amount / 100, 0) || 0,
  poolRate: (state, getters) =>
    ((getters.poolTotalStartBalance - getters.poolTotalCurrentBalance) /
      getters.poolTotalStartBalance) *
      100 || 0,
  stash: state =>
    state.results
      .filter(coin => !!coin.current_amount)
      .map(coin => symbolToAsset(coin.currency)),
};
const actions = {
  async getPoolDetails({ commit, getters }) {
    commit('setPool', {
      fetching: true,
      results: getters.pool.results,
    });

    try {
      const data = await pool.fetch();

      if (data?.success) {
        this.pool = data.response;

        commit('setPool', {
          fetching: false,
          results: data.response,
        });
      }
    } finally {
      commit('setPool', {
        fetching: false,
        results: getters.pool.results,
      });
    }
  },
};

const mutations = {
  setPool(state, { fetching, results }) {
    Vue.set(state, 'fetching', fetching);
    Vue.set(state, 'results', results);
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
