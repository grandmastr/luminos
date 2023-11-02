<template>
  <container>
    <ol role="tablist">
      <li
        v-for="tab in tabs"
        :key="tab.icon"
        role="tab"
        @click.prevent="goToTab(activeTab, tab.name)"
        :class="{ active: tab.name === activeTab }"
      >
        <component :is="tab.icon" />
      </li>
      <!--      <template v-if="user.account_type !== 'POOL_PROVIDER'">-->
      <!--        <transition-group name="fade" tag="li">-->
      <!--          <i data-feather="droplet" :key="'pool'" />-->
      <!--        </transition-group>-->
      <!--      </template>-->
    </ol>
  </container>
</template>

<script>
import styled from 'vue-styled-components';
import feather from 'feather-icons';
import { mapGetters } from 'vuex';

import { setMaxWidth, toPx } from '@/helpers';
import { BOTTOM_NAVIGATION_HEIGHT } from '@/constants';
import { Home, Settings, Transact } from '@/assets';

const Container = styled('nav')`
  background-color: ${({ theme }) => theme.colors.white};
  position: fixed;
  bottom: 0;
  height: ${toPx(BOTTOM_NAVIGATION_HEIGHT)};
  width: 100%;
  z-index: 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.16);
  display: flex;
  place-items: center;
  place-content: center;

  ol {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: repeat(auto-fill, 1fr);
    ${setMaxWidth(1024)};
    height: 100%;

    li {
      place-self: center;
      height: 36px;
      width: 36px;
      display: grid;
      place-items: center;
      place-content: center;
      transition: 300ms color, 400ms background-color;

      &.active {
        background-color: rgba(46, 49, 146, 0.1);
        border-radius: 8px;

        svg {
          * {
            stroke: ${({ theme }) => theme.colors.purple};
          }
        }
      }
    }
  }
`;

export default {
  name: 'BottomNav',
  components: { Container, Settings, Transact, Home },
  data() {
    return {
      activeTab: '',
    };
  },
  mounted() {
    feather.replace({
      height: '20px',
      width: '20px',
    });

    this.activeTab = this.tabs[0].name;
  },
  computed: {
    ...mapGetters('user', ['user']),
  },
  props: {
    tabs: {
      type: Array,
      required: false,
      default: () => [
        {
          name: 'coins',
          icon: 'home',
        },
        {
          name: 'transactions',
          icon: 'transact',
        },
        {
          name: 'settings',
          icon: 'settings',
        },
      ],
    },
  },
  methods: {
    goToTab(current, next) {
      if (current !== next) {
        this.$emit('goToTab', { current, next });
        this.activeTab = next;
      }
    },
  },
};
</script>
