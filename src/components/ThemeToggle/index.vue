<script>
import styled from 'vue-styled-components';

import { query, toPx } from '@/helpers';

const ThemeToggleButton = styled('button')`
  background-color: ${({ theme }) => theme.colors.purple};
  position: fixed;
  left: ${toPx(20)};
  bottom: 3%;
  height: ${toPx(50)};
  width: ${toPx(50)};
  border-radius: 50%;
  border: none;
  outline: none;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px 1px rgba(0, 0, 0, 0.1);

  ${query.maxWidth('small')`
    background-color: orange;
    bottom: 8%;
  `}
`;
export default {
  name: 'ThemeToggle',
  components: {
    ThemeToggleButton,
  },
  methods: {
    toggleTheme() {
      console.log('yeah, duped');
    },
  },
};
</script>

<template>
  <theme-toggle-button aria-label="toggle theme" @click="toggleTheme"
    >D
  </theme-toggle-button>
</template>
