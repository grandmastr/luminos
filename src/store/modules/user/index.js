import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

import { user } from '@/api';
import Router from '@/router';
import { BREAKPOINTS } from '@/constants';

const state = () => ({
  user: JSON.parse(localStorage.getItem('bravo-zulu')) || {},
  token: Cookies?.get('bravo-zulu') || '',
  signUpDetails: JSON.parse(sessionStorage.getItem('bravo-zulu')) || {},
  activeSwapCoin: null,
  hideBalance: true,
  isMobile: window.screen.width <= BREAKPOINTS.medium,
  isDesktop: window.screen.width > BREAKPOINTS.medium,
  activeTransaction: null,
});

const getters = {
  user: state => state.user,
  token: state => state.token,
  signUpDetails: state => state.signUpDetails,
  activeSwapCoin: state => state.activeSwapCoin,
  hideBalance: state => state.hideBalance,
  isMobile: state => state.isMobile,
  isDesktop: state => state.isDesktop,
  activeTransaction: state => state.activeTransaction,
};

const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setToken(state, token) {
    state.token = token;
  },
  setActiveSwapCoin(state, coin) {
    state.activeSwapCoin = coin;
  },
  setHideBalance(state, hide) {
    state.hideBalance = hide;
  },
  setResponsiveness(state, { mobile, desktop }) {
    state.isMobile = mobile;
    state.isDesktop = desktop;
  },
  setSignUpDetails(state, body) {
    state.signUpDetails = {
      ...state.signUpDetails,
      ...body,
    };

    const mutatedDetails = Object.assign({}, state.signUpDetails);

    Object.defineProperty(mutatedDetails, 'password', {
      enumerable: false,
    });

    if (!body.password) {
      window.sessionStorage.setItem(
        'bravo-zulu',
        JSON.stringify({ ...mutatedDetails }),
      );
    }
  },
  setActiveTransaction(state, payload) {
    state.activeTransaction = payload;
  },
};

const actions = {
  async syncToken({ commit }, token) {
    const data = await CryptoJS?.TripleDES.encrypt(
      token,
      'pluginUpdatesAvailable',
    ).toString();

    Cookies.set('bravo-zulu', data, { expires: 1, sameSite: 'Lax' });
    commit('setToken', token);
  },
  async syncUserData({ commit }, { user }) {
    // eslint-disable-next-line no-unused-expressions
    localStorage.setItem('bravo-zulu', JSON.stringify(user));
    commit('setUser', user);
  },
  async updateUser({ commit, getters }, body) {
    const data = await user.update(body);

    if (data?.success) {
      localStorage.setItem('bravo-zulu', JSON.stringify(data.response));
      commit('setUser', data.response);

      return {
        ...data,
      };
    }
  },
  async logout({ commit }) {
    await Cookies?.remove('bravo-zulu');
    await localStorage.removeItem('bravo-zulu');

    commit('setUser', '');
    commit('setToken', '');

    await Router.push('/welcome');
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
