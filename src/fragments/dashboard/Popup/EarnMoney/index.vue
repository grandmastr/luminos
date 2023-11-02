<template>
  <Popup>
    <h2>Earn more money on the fly</h2>
    <p>
      Commit some cash to help the swap cause and get profit from instant swap
      orders fulfiled with your cash
    </p>
    <Earn />
    <Button
      text="Get started here"
      styles="font-size: 14px; margin-top: 43.67px"
      @click="getStarted"
    />
  </Popup>
</template>

<script>
import { Button } from '@/components';
import { Earn } from '@/assets';
import styled from 'vue-styled-components';

const Popup = styled('article')`
   {
    text-align: center;
    padding: 45px 0;

    h2 {
      font-family: ${({ theme }) => theme.fontFamily('Fraunces')};
      color: ${({ theme }) => theme.colors.purple};
      max-width: 219px;
      margin: 0 auto;
    }

    p {
      margin: 20px auto 24px auto;
      font-size: 14px;
      line-height: 140%;
      max-width: 280px;
      color: ${({ theme }) => theme.colors.text.secondary.light};
    }
  }
`;

export default {
  components: {
    Popup,
    Button,
    Earn,
  },
  methods: {
    getStarted() {
      this.$emit('getPoolProvisionStarted');
    },
  },
};
</script>
