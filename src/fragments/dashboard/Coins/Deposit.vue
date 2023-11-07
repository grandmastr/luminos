<template>
  <Deposit>
    <template>
      <SingleDropdown
        label="Select Coin"
        type="text"
        :disabled="true"
        @change="setCoin"
        v-model="coin"
        class="dropdown"
      />
      <template v-if="wallets.fetching">
        <div class="spinner-container">
          <spinner />
        </div>
      </template>
      <template v-else>
        <p class="wallet">{{ coin }} wallet address</p>
        <div class="address-details">
          <div class="address">
            <p>{{ address }}</p>
          </div>
          <div class="icon-wrapper">
            <Copy role="button" @click="copyAddress" />
          </div>
        </div>
      </template>
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
    /**
     * Sets the coin value based on the given currency.
     *
     * @param {Object} currency - The currency object containing the name and network.
     * @return {void}
     */
    setCoin(currency) {
      this.coin = `${currency.name} (${currency.network})`;
    },
    /**
     * Copies the address to the clipboard.
     */
    copyAddress() {
      copy(this.address, 'Copied wallets address');
    },
    /**
     * Sets the address based on the provided value.
     *
     * @param {string} value - The value containing the token and network information.
     * @return {Promise<void>} - A promise that resolves when the address is set.
     */
    async setAddress(value) {
      const token = value.split(' ')[0];
      const network = value.split(' ')[1].replace(/[()]/g, '');

      const index = this.wallets.results.findIndex(
        wallet =>
          wallet.asset === assetToSymbol(token) && wallet.network === network,
      );

      if (index < 0) {
        this.processing = true;

        try {
          console.log('here', token);
          console.log('buddy', assetToSymbol(token));
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
    },
    ...mapActions('wallets', ['fetchWallets']),
  },
  watch: {
    /**
     * Sets the address for the coin.
     *
     * @param {type} value - The value to set the address to.
     */
    coin(value) {
      this.address = '';
      this.setAddress(value);
    },
  },
};
</script>
