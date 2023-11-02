import Vue from 'vue';

import { monkeyboard } from '@/api';
import { setPosition } from '@/helpers';

const state = {
  fetching: false,
  results: [],
};

const actions = {
  async getMonkeyboard({ commit, getters }) {
    commit('setMonkeyboard', {
      fetching: true,
      results: getters.monkeyboard.results,
    });
    try {
      const data = await monkeyboard.get();

      if (data?.success) {
        commit('setMonkeyboard', {
          fetching: false,
          results: data.response,
        });
      }
    } finally {
      commit('setMonkeyboard', {
        fetching: false,
        results: getters.monkeyboard.results,
      });
    }
  },
};

const mutations = {
  setMonkeyboard(state, { fetching, results }) {
    Vue.set(state, 'fetching', fetching);
    Vue.set(state, 'results', results);
  },
};

const getters = {
  monkeyboard: state => {
    const copiedResults = [];

    state.results.forEach((member, index) => {
      copiedResults.push({
        ...member,
        swap_tag:
          member.swap_tag ||
          `@anonymous${Math.round(Math.random() * index * 100)}`,
        position: setPosition(copiedResults, member, index),
      });
    });

    return {
      ...state,
      results: copiedResults.slice(),
    };
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
