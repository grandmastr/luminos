<template>
  <container>
    <div>
<!--      <shocked-monkey />-->
      <span class="title" v-if="title"> {{ title }} </span>
      <span class="title" v-else> No {{ type }} swaps </span>
      <span class="shalaye">
        <slot>
          You do not have any {{ type }} swaps at the moment. Initiate a swap
          request to change this.
        </slot>
      </span>
    </div>
  </container>
</template>

<script>
import styled from 'vue-styled-components';

import { ShockedMonkey } from '@/assets';

const Container = styled('div')`
  display: grid;
  place-items: center;
  height: 500px;
  width: 100%;

  > div {
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  span {
    color: ${({ theme }) => theme.colors.text.secondary.light};

    &.title {
      display: inline-block;
      margin-top: 0.8em;
      font-size: 1.6em;
      font-weight: 600;
      font-family: ${({ theme }) => theme.fontFamily('Fraunces')};
    }

    &.shalaye {
      margin-top: 1.2em;
      font-size: 0.9em;
      font-weight: normal;
      line-height: 140%;
    }
  }
`;

export default {
  name: 'Empty',
  // eslint-disable-next-line vue/no-unused-components
  components: { Container, ShockedMonkey },
  props: {
    type: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
  },
};
</script>
