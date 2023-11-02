<template>
  <error>
    <logo class="logo" />
    <error-icon class="error-type" />
    <h1>Something went wrong!</h1>
    <p>
      There seems to be some monkey business going on here, this page is not
      available.
    </p>
    <router-link to="/">
      <styled-button size="default" width="200px">
        <span>Back to dashboard</span>
        <div class="icon" aria-hidden="true">
          <i data-feather="chevron-right" class="chevron-right"></i>
        </div>
      </styled-button>
    </router-link>
  </error>
</template>

<script>
import styled from 'vue-styled-components';
import feather from 'feather-icons';

import { ErrorIcon, Logo } from '@/assets';
import { Button } from '@/components';

const Error = styled.main`
   {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 49px;
    flex-direction: column;
    position: relative;
    text-align: center;

    .logo {
      position: absolute;
      top: 49px;
    }

    h1 {
      color: ${({ theme }) => theme.colors.orange};
      font-family: ${({ theme }) => theme.fontFamily('Fraunces')};
    }

    p {
      margin: 0;
      max-width: 380px;
      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
    }
  }
`;

const StyledButton = styled(Button)`
  height: 54px;
  position: relative;
  margin-top: 64px;
  padding: 0;

  div.icon {
    display: grid;
    place-items: center;
    background-color: rgba(0, 0, 0, 0.2);
    height: 100%;
    width: 36px;
    margin-left: auto;

    svg {
      color: ${({ theme }) => theme.colors.orange};
      margin: 0;
    }
  }

  span {
    padding: 15px;
    font-size: 14px;
  }
`;

export default {
  components: {
    Error,
    Logo,
    ErrorIcon,
    StyledButton,
  },
  data() {
    return {
      monkey: require('@/assets/avatars/1.webp'),
    };
  },
  mounted() {
    feather.replace({
      width: '16px',
    });
  },
};
</script>

<style lang="scss" scoped></style>
