<template>
  <container>
    <div class="hm">
      <h3>Upgrade in progress...</h3>
      <p>
        Thank you for visiting Lumino. Swaps are currently down as we are
        working on some exciting new features, however you can still send and
        receive crypto assets. We apologise for the inconvenience. Please check
        back soon.
      </p>
    </div>
    <hanging-monkey class="mike-the-monkey" />
    <div class="hm">
      <s-button text="Okay, got it" @click="$emit('dismiss')" />
    </div>
  </container>
</template>

<script>
import styled from 'vue-styled-components';

import { HangingMonkey } from '@/assets';
import { Button as SButton } from '@/components';

const Container = styled('article')`
  padding: 0.5em 1.4em 2em;
  margin: 0 -2.8em;
  text-align: center;

  div.hm {
    padding: 0 2.8em;
  }

  h3 {
    color: ${({ theme }) => theme.colors.purple};
    font-family: ${({ theme }) => theme.fontFamily('Fraunces')};
    font-size: 1.3em;
  }

  p {
    line-height: 1.8em;
    color: ${({ theme }) => theme.colors.text.secondary.light};
    font-size: 1em;
  }

  svg.mike-the-monkey {
    position: relative;
    top: -200px;
    width: 100%;
    margin-bottom: -180px;
  }
`;

Container.name = 'downtime-article-container';

export default {
  name: 'DownTimeWarning',
  components: {
    Container,
    HangingMonkey,
    SButton,
  },
};
</script>
