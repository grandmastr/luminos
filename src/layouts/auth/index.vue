<template>
  <container :height="height">
    <div class="grid-container">
      <div class="auth-column-2">
        <styled-card :height="height">
          <slot></slot>
        </styled-card>
      </div>
    </div>
  </container>
</template>

<script>
import styled from 'vue-styled-components';

import { setMaxWidth } from '@/helpers';
import { Card } from '@/components';

const EllipseParticle = styled('div')`
  height: 0.8rem;
  width: 0.8rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors['particle-background']};
  position: absolute;
`;

const StyledCard = styled(Card)`
  align-self: center;
  padding: 1.25em 1em;
  background-color: ${({ theme }) => theme.colors.white};
`;

const containerProps = {
  height: {
    type: String,
    required: false,
    default() {
      return 'auto';
    },
  },
};

const Container = styled('div', containerProps)`
  background-color: ${({ theme }) => theme.colors.background};
  height: 100vh;
  padding: 3em 2em;

  div.grid-container {
    ${setMaxWidth()};
    height: calc(100vh - 6rem);
    position: relative;

    display: grid;
    grid-gap: 5rem;

    div.auth-column-1 {
      display: flex;

      .giant {
        align-self: center;
        height: calc(100vw / 2);
        width: calc(100vw / 2);
      }
    }

    div.auth-column-2 {
      min-width: 280px;
      max-width: 380px;
      width: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      justify-content: center;

      > * {
        width: 100%;
      }
    }
    grid-template-columns: none;
    place-items: center;
  }
`;

Container.name = 'Container';
EllipseParticle.name = 'EllipseParticle';

export default {
  name: 'AuthLayout',
  components: { Container, StyledCard },
  props: {
    ...containerProps,
  },
};
</script>
