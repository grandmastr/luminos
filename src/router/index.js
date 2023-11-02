import Vue from 'vue';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';

import { Dashboard, Error } from '@/views';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/welcome',
    name: 'SignIn',
    component: () =>
      import(/* webpackChunkName: "SignIn" */ '@/views/auth/Welcome'),
  },
  {
    path: '/sign-up',
    component: () =>
      import(/* webpackChunkName: "SignUp" */ '@/views/auth/SignUp'),
    children: [
      {
        path: '/',
        name: 'SignUp',
        component: () =>
          import(
            /* webpackChunkName: "SignUpName" */ '@/views/auth/SignUp/Step1'
          ),
      },
      {
        path: 'step-2',
        name: 'SignUpName',
        component: () =>
          import(
            /* webpackChunkName: "SignUpName" */ '@/views/auth/SignUp/Step2'
          ),
      },
      {
        path: 'step-3',
        name: 'SignUpCountry',
        component: () =>
          import(
            /* webpackChunkName: "SignUpCountry" */ '@/views/auth/SignUp/Step3'
          ),
      },
      {
        path: 'step-4',
        name: 'SignUpPassword',
        component: () =>
          import(
            /* webpackChunkName: "SignUpPassword" */ '@/views/auth/SignUp/Step4'
          ),
      },
      {
        path: 'step-5',
        name: 'SignUpSwapTag',
        component: () =>
          import(
            /* webpackChunkName: "SignUpSwapTag" */ '@/views/auth/SignUp/Step5'
          ),
      },
    ],
  },
  {
    path: '*',
    name: 'Error',
    component: Error,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

const test = false;
if (test)
  router.beforeEach(async (to, from, next) => {
    // eslint-disable-next-line no-undef
    // eslint-disable-next-line no-unused-vars
    const isAuthenticated = await Cookies?.get('bravo-zulu');

    const authRoutes = [
      'SignIn',
      'SignUp',
      'SignUpName',
      'SignUpCountry',
      'SignUpSwapTag',
      'SignUpPassword',
    ];

    if (authRoutes.includes(to.name)) {
      if (isAuthenticated) {
        next({ name: 'Dashboard' });
      }
    } else {
      if (!isAuthenticated) {
        next({ name: 'SignIn' });
      }
    }

    next();
  });

export default router;
