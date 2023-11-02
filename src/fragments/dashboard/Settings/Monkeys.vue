<template>
  <transition name="fade" tag="article">
    <container :offsetTop="offsetTop"> money way</container>
  </transition>
</template>

<script>
import styled from 'vue-styled-components';

import { setMaxWidth } from '@/helpers';

const containerProps = {
  offsetTop: {
    type: [String, Number],
    required: false,
    default() {
      return '20px';
    },
  },
};

const Container = styled('div', containerProps)`
  align-self: center;
  border-radius: 8px;
  ${setMaxWidth(420)};
  height: 450px;
  background-color: ${({ theme }) => theme.colors.white};
  position: absolute;
  top: ${({ offsetTop }) => offsetTop};
  //transform: translateX(10%);
`;

export default {
  name: 'MonkeyList',
  props: {
    ...containerProps,
  },
  components: { Container },
};
</script>
