<template>
  <Deposit>
    <template v-if="wallets.fetching">
      <div class="spinner-container">
        <spinner />
      </div>
    </template>
    <template v-else>
      <SingleDropdown
        label="Select Coin"
        type="text"
        :disabled="true"
        @change="setCoin"
        v-model="coin"
        class="dropdown"
      />
      <p class="wallet">{{ coin | assetToSymbol }} wallet address</p>
      <div class="address-details">
        <div class="address">
          <p>{{ address }}</p>
        </div>
        <div class="icon-wrapper">
          <Copy role="button" @click="copyAddress" />
        </div>
      </div>
    </template>
  </Deposit>
</template>

<script>
import styled from 'vue-styled-components';
import { mapActions, mapGetters } from 'vuex';

import { SingleDropdown, Spinner } from '@/components';
import { Copy } from '@/assets';
import { assetToSymbol, copy } from '@/helpers';

const Deposit = styled('article')`
   {
    padding: 22px 0;

    .dropdown {
      margin-bottom: 28px;
    }

    div.spinner-container {
      height: 154px;
      display: grid;
      place-items: center;
    }

    .wallet {
      font-size: 12px;
      font-weight: bold;
      line-height: 17px;
      letter-spacing: 0.1em;
      margin: 0;
      text-transform: uppercase;
      margin-bottom: 12px;
      color: ${({ theme }) => theme.colors.text.secondary.lighter};
    }

    .address-details {
      display: flex;
      align-items: center;
      height: 44px;

      .address {
        width: calc(100% - 46px);
        padding: 13px;
        height: 100%;
        border-radius: 4px 0 0 4px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        overflow-x: auto;

        &::-webkit-scrollbar {
          width: 0;
          background: transparent;
          display: none;
        }

        p {
          margin: 0;
          color: ${({ theme }) => theme.colors.purple};
        }
      }

      .icon-wrapper {
        display: grid;
        place-items: center;
        border-radius: 0 4px 4px 0;
        border: 1px solid rgba(0, 0, 0, 0.1);
        width: 46px;
        height: 100%;
      }
    }
  }
`;

export default {
  components: {
    SingleDropdown,
    Deposit,
    Copy,
    Spinner,
  },
  data() {
    return {
      coin: '',
      address: '',
    };
  },
  mounted() {
    if (!this.wallets.results.length && !this.wallets.fetching) {
      this.fetchWallets();
    }
  },
  computed: mapGetters('wallets', ['wallets']),
  methods: {
    setCoin(currency) {
      this.coin = currency.name;
    },
    copyAddress() {
      copy(this.address, 'Copied wallets address');
    },
    setAddress(value) {
      this.address =
        this.wallets.results.find(
          wallet => wallet.currency === assetToSymbol(value),
        )?.address || '';
    },
    ...mapActions('wallets', ['fetchWallets']),
  },
  watch: {
    coin(value) {
      this.setAddress(value);
    },
  },
};
</script>
