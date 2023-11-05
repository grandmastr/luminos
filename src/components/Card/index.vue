<template>
  <container
    :color="color"
    :height="height"
    :width="width"
    :overflow="overflow"
  >
    <slot />
  </container>
</template>

<script>
import styled from 'vue-styled-components';
import { query, toPx } from '@/helpers';
import { BOTTOM_NAVIGATION_HEIGHT } from '@/constants';

const cardProps = {
  color: {
    type: String,
    required: false,
  },
  height: {
    type: String,
    required: false,
    default() {
      return 'auto';
    },
  },
  width: {
    type: String,
    required: false,
    default() {
      return '100%';
    },
  },
  overflow: {
    type: String,
    required: false,
    default() {
      return 'none';
    },
  },
};

const Container = styled('div', cardProps)`
  background-color: ${({ theme, color }) =>
    color || theme.colors['ghost-white-background']};
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.16);
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  border-radius: 8px;
  padding: 2.5rem 1.5rem;
  overflow: ${({ overflow }) => overflow};
  display: flex;
  flex-direction: column;

  ${query.maxWidth('large1')`
    box-shadow: none;
    padding: 0 0.2rem;
    margin-bottom: ${toPx(BOTTOM_NAVIGATION_HEIGHT / 2)};
  `};

  .t-padding {
    padding-top: 1rem;
  }
`;

Container.name = 'CardContainer';

export default {
  name: 'Card',
  components: { Container },
  props: {
    ...cardProps,
  },
};
</script>
