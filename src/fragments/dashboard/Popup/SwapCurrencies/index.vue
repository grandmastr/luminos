<template>
  <Popup>
    <h2>What currencies should your cash be swapped with?</h2>
    <ul>
      <li v-for="(crypto, index) in cryptos" :key="crypto.code">
        <div>
          <component :is="crypto.name" class="list-image" />
          <p>
            {{ crypto.name }} <span>({{ crypto.code }})</span>
          </p>
        </div>
        <SelectionControl :index="index" name="currency" :value="crypto.name" />
      </li>
    </ul>
    <hr />
    <Button text="Next" styles="font-size: 14px" @click="goToDuration" />
  </Popup>
</template>

<script>
import { Button, SelectionControl } from '@/components';
import {
  Bitcoin,
  Dash,
  Doge,
  Ethereum,
  Fiat,
  Litecoin,
  Tether,
  Tron,
} from '@/assets';
import { cryptos } from '@/lib';
import styled from 'vue-styled-components';

const Popup = styled('article')`
   {
    padding: 18px 0;

    h2 {
      font-family: ${({ theme }) => theme.fontFamily('Fraunces')};
      color: ${({ theme }) => theme.colors.purple};
      text-align: center;
      margin: 0 auto 21px auto;
    }

    ul {
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;

        &:not(last-of-type) {
          margin-bottom: 12px;
        }

        div {
          display: flex;
          align-items: center;
          justify-content: space-between;

          svg {
            margin-right: 12.31px;
          }

          p span {
            color: ${({ theme }) => theme.colors.text.secondary.light};
          }
        }
      }
    }

    hr {
      width: calc(100% + 36px);
      transform: translateX(-18px);
      margin-bottom: 30px;
      border: 1px solid rgba(12, 16, 58, 0.1);
    }
  }
`;

export default {
  components: {
    Popup,
    Button,
    SelectionControl,
    Fiat,
    Bitcoin,
    Ethereum,
    Tether,
    Tron,
    Dash,
    Litecoin,
    Doge,
  },
  data() {
    return {
      cryptos,
    };
  },
  methods: {
    goToDuration() {
      this.$emit('goToDuration');
    },
  },
};
</script>
