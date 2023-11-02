import Vue from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

import Router from '@/router';
import { NProgress } from '@/lib';

const server = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
});

const getToken = async () => {
  const encryptedToken = await Cookies?.get('bravo-zulu');

  if (encryptedToken) {
    const tokenByte = await CryptoJS?.TripleDES.decrypt(
      encryptedToken,
      'pluginUpdatesAvailable',
    );

    return tokenByte.toString(CryptoJS?.enc.Utf8);
  }
};

server.interceptors.request.use(async config => {
  const token = await getToken();

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  NProgress.start();
  return config;
});

server.interceptors.response.use(
  response => {
    NProgress.done();
    return response;
  },
  async err => {
    NProgress.done();

    if (err.response.status === 401) {
      await Cookies?.remove('bravo-zulu');
      await localStorage.removeItem('bravo-zulu');

      await Router.push('/welcome');
    }
    return Promise.reject(err);
  },
);

Vue.prototype.$server = server;

export default server;
