import Vue from 'vue';
import { ThemeProvider } from 'vue-styled-components';
import AOS from 'aos';
import feather from 'feather-icons';
import 'aos/dist/aos.css';

import theme from '@/base/theme';

// global-styles
import '@/base/normalize-css';
import '@/base/global-style';

export default Vue.component('App', {
  mounted() {
    this.initialize();

    // eslint-disable-next-line no-unused-expressions
    AOS?.init({
      duration: 400,
      easing: 'ease-in',
      disable: 'mobile',
      once: 'true',
    });

    window.addEventListener('resize', this.initialize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.initialize);
  },
  methods: {
    initialize() {
      feather.replace();
    },
  },
  render() {
    return (
      <ThemeProvider theme={theme}>
        <transition name={'fade'}>
          <router-view />
        </transition>
      </ThemeProvider>
    );
  },
});
