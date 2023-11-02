<template>
  <container :length="tabs.length">
    <div class="tabs">
      <div role="tablist">
        <button
          role="tab"
          v-for="tab in tabs"
          :key="tab.id"
          :class="[{ active: tab.id === activeTab.id }]"
          @click="handleTabClick(tab)"
        >
          {{ tab.title }}
        </button>
      </div>
    </div>
  </container>
</template>

<script>
import styled from 'vue-styled-components';

const tabProps = {
  length: {
    type: String | Number,
    required: true,
    default() {
      return 3;
    },
  },
};

const Container = styled('div', tabProps)`
  display: grid;
  place-items: center;

  div.tabs {
    background-color: ${({ theme }) => theme.colors.white};
    height: 32px;
    width: 80%;
    margin-bottom: 16px;
    border-radius: 8px;
    overflow: hidden;

    div[role='tablist'] {
      display: flex;
      flex-direction: row;
      height: 100%;

      button {
        all: unset;
        display: grid;
        place-items: center;
        place-content: center;
        width: ${({ length }) => `calc(100% / ${length})`};
        transition: opacity 200ms, background 200ms, color 250ms;

        &:not(:disabled) {
          cursor: pointer;
        }

        font-size: 0.8em;
        color: ${({ theme }) => theme.colors.purple};

        &.active {
          background-color: ${({ theme }) => theme.colors.purple};
          color: ${({ theme }) => theme.colors.white};

          &:hover {
            opacity: 0.8;
          }
        }

        &:not(.active) {
          &:hover {
            background-color: ${({ theme }) =>
              theme.tabs.inactive['hover-background']};
            color: ${({ theme }) => theme.tabs.inactive.color};
          }
        }
      }
    }
  }
`;

export default {
  name: 'Tabs',
  data() {
    return {
      activeTab: Object.create({}),
    };
  },
  components: {
    Container,
  },
  props: {
    tabs: {
      type: Array,
      required: true,
      default() {
        return [
          { title: 'Pending', id: 'PENDING' },
          { title: 'Ongoing', id: 'ONGOING' },
          { title: 'Fulfilled', id: 'FULFILLED' },
        ];
      },
    },
    default: {
      type: [Number, String],
      required: false,
      default() {
        return 0;
      },
    },
  },
  mounted() {
    this.activeTab = this.tabs[this.default];
    this.$emit('tabClick', this.activeTab);
  },
  methods: {
    handleTabClick(tab) {
      this.activeTab = tab;
      this.$emit('tabClick', tab);
    },
  },
};
</script>
