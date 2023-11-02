<template>
  <div>
    <Head>
      <Back role="button" @click="$router.back()" />
      <p>
        <slot name="head">Create an account</slot>
      </p>
      <span></span>
    </Head>
    <Title v-if="text">
      <h3>{{ text }}</h3>
      <p>
        <slot name="title"
          >Before we proceed, kindly verify that this information is correct
        </slot>
      </p>
    </Title>
  </div>
</template>

<script>
import styled from 'vue-styled-components';
import { Back } from '@/assets';

const Head = styled.div`
   {
    display: flex;
    align-items: center;
    margin-bottom: 42px;
    justify-content: space-between;

    p {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.purple};
      text-align: center;
    }
  }
`;

const Title = styled.div`
   {
    margin-bottom: 44px;

    h3 {
      color: ${({ theme }) => theme.colors.purple};
      font-family: ${({ theme }) => theme.fontFamily('Fraunces')};
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 600;
      line-height: 34px;
    }

    p {
      font-size: 0.9em;
      font-weight: 500;
      line-height: 20px;
      color: ${({ theme }) => theme.colors.text.secondary.light};
      margin-top: 24px;
    }
  }
`;

export default {
  props: {
    text: String,
  },
  components: {
    Head,
    Title,
    Back,
  },
};
</script>
