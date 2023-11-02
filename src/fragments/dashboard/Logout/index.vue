<template>
  <container>
    <template v-if="loggingOut">
      <div class="spinner-container">
        <spinner />
      </div>
    </template>
    <template v-else>
      <h2>Are you sure?</h2>

      <p>Please confirm that you want to log out of your account</p>

      <div class="button-group">
        <styled-button @click="dismiss">Cancel</styled-button>
        <Button @click="attemptLogout">Logout</Button>
      </div>
    </template>
  </container>
</template>

<script>
import { mapActions } from 'vuex';
import styled from 'vue-styled-components';

import { Button, Spinner } from '@/components';
import { wait } from '@/helpers';

const StyledButton = styled(Button)`
  background-color: rgba(46, 49, 146, 0.1);
  border-color: rgba(46, 49, 146, 0.1);
  color: ${({ theme }) => theme.colors.purple};
`;

const Container = styled('article')`
  padding: 1.075em 0.575em;
  min-height: 240px;
  height: 100%;

  div.spinner-container {
    display: grid;
    place-items: center;
    height: calc(240px - (1.075em * 2));
  }

  h2 {
    color: ${({ theme }) => theme.colors.purple};
    font-size: 1.375em;
    font-family: ${({ theme }) => theme.fontFamily('Fraunces')};
    font-weight: 600;
  }

  p {
    font-weight: normal;
    font-size: 0.875em;
    color: ${({ theme }) => theme.colors.text.secondary.light};
    line-height: 140%;
  }

  div.button-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 20px;
    margin-top: 42px;
  }
`;

export default {
  name: 'Logout',
  data() {
    return {
      loggingOut: false,
    };
  },
  components: { Container, Button, StyledButton, Spinner },
  methods: {
    dismiss() {
      this.$emit('dismiss');
    },
    async attemptLogout() {
      this.loggingOut = true;
      await wait(() => this.logout(), 1000);
    },
    ...mapActions('user', ['logout']),
  },
};
</script>
