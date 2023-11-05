<template>
  <Deposit>
    <!--    <template v-if="wallets.fetching">-->
    <!--      <div class="spinner-container">-->
    <!--        <spinner />-->
    <!--      </div>-->
    <!--    </template>-->
    <template>
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
import { wallets } from '@/api';

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
    // eslint-disable-next-line vue/no-unused-components
    Spinner,
  },
  data() {
    return {
      coin: '',
      address: '',
      processing: false,
    };
  },
  mounted() {
    console.log('soso');
    if (!this.wallets.results.length && !this.wallets.fetching) {
      this.fetchWallets();
      console.log('target', this.wallets);
    }
  },
  computed: mapGetters('wallets', ['wallets']),
  methods: {
    setCoin(currency) {
      this.coin = `${currency.name} (${currency.network})`;
    },
    copyAddress() {
      copy(this.address, 'Copied wallets address');
    },
    async setAddress(value) {
      const token = value.split(' ')[0];
      const network = value.split(' ')[1].replace(/[()]/g, '');

      const index = this.wallets.results.findIndex(
        wallet =>
          wallet.asset === assetToSymbol(token) && wallet.network === network,
      );
      console.log(index);
      console.log(assetToSymbol(token), network, value);
      console.log(this.wallets.results);
      console.log(
        'reward',
        this.wallets.results.findIndex(
          wallet =>
            wallet.asset === assetToSymbol(token) && wallet.network === network,
        ),
      );

      if (index < 0) {
        this.processing = true;

        try {
          const { success } = await wallets.createAddress({
            asset: assetToSymbol(token),
            network,
          });

          if (success) {
            await this.fetchWallets();
          }
        } finally {
          this.processing = false;
        }
      } else {
        this.address = this.wallets.results[index].address;
      }

      // this.address =
      //   this.wallets.results.find(
      //     wallet => wallet.currency === assetToSymbol(value),
      //   )?.address || '';
    },
    ...mapActions('wallets', ['fetchWallets']),
  },
  watch: {
    coin(value) {
      this.address = '';
      this.setAddress(value);
    },
    // wallets() {
    //   this.setAddress(this.coin);
    // },
  },
};
</script>
