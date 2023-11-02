<template>
  <SendCoinsContainer @submit.prevent="sendCoin">
    <dropdown
      label="Amount"
      :list="list"
      type="number"
      initial="Bitcoin"
      v-model="fromAmount"
      @change="setFromCurrency"
      class="dropdown"
    />
    <div class="balance-container" v-if="!wallets.fetching">
      <span class="balance"
        >Balance: {{ fromCurrencyBalance | formatNumber }}
        {{ fromCurrency | assetToSymbol }}</span
      >
      <span class="select-all" role="button" @click="swapAll"> send all </span>
    </div>
    <!--    <dropdown-->
    <!--      label="Equivalent"-->
    <!--      :list="list"-->
    <!--      type="tel"-->
    <!--      v-model="toAmount"-->
    <!--      @change="setToCurrency"-->
    <!--      class="dropdown"-->
    <!--      disabled-->
    <!--    ></dropdown>-->
    <!--    <p class="rate">RATE: 20,456,678.46/BTC</p>-->
    <hr />
    <div class="address-container">
      <Input
        :label="`Recipient's ${fromCurrency} wallet Address`"
        v-model="walletAddress"
        type="text"
        placeholder=" "
      />
    </div>
    <div class="table">
      <div class="tr">
        <p class="th">CHARGES</p>
        <p class="td">
          <spinner :size="10" v-if="fees.fetching" />
          <template v-else>
            {{
              (fromCurrency === 'Ethereum'
                ? Number(fee.average / Math.pow(10, 9)).toFixed(8)
                : fee.average) || 0
            }}
            {{ fromCurrency | assetToSymbol }}
            {{ fromCurrency ? fromCurrency.code : 'BTC' }}
          </template>
        </p>
      </div>
      <!--      <div class="tr">-->
      <!--        <p class="th">YOU GET</p>-->
      <!--        <p class="td big">-->
      <!--          <spinner :size="10" v-if="fees.fetching" />-->
      <!--          <template v-else>-->
      <!--            {{ whatYouGet | formatAmount }}-->
      <!--            {{ toCurrency ? toCurrency.code : 'FIAT' }}-->
      <!--          </template>-->
      <!--        </p>-->
      <!--      </div>-->
    </div>
    <Button @click="$emit('click')" text="Send" :disabled="disabled" />
  </SendCoinsContainer>
</template>

<script>
import styled from 'vue-styled-components';

import { Button, Dropdown, Input, Spinner } from '@/components';
import { assetToSymbol } from '@/helpers';
import { wallets } from '@/api';
import { cryptos } from '@/lib';
import { mapGetters } from 'vuex';

const SendCoinsContainer = styled('form')`
   {
    padding: 22px 0;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 0;
      background: transparent;
      display: none;
    }

    div.balance-container {
      position: relative;
      top: -20px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      span.balance {
        font-size: 0.75em;
        color: ${({ theme }) => theme.colors['dark-blue']};
        font-weight: 500;
      }

      span.select-all {
        margin-left: 8px;
        font-size: 0.75em;
        color: ${({ theme }) => theme.colors.orange};
        font-weight: 600;
        text-transform: uppercase;
        border-radius: 2px;
        transition: 200ms ease-in-out;

        &:hover {
          color: ${({ theme }) => theme.colors.purple};
        }
      }
    }

    .dropdown {
      margin-bottom: 28px;
    }

    hr {
      border: 1px solid rgba(12, 16, 58, 0.1);
      margin-bottom: 1.5em;
    }

    div.address-container {
      label {
        display: inline-block;
        margin-bottom: 0.75em;
        color: ${({ theme }) => theme.colors.text.secondary.lighter};
        font-variant: small-caps;
        font-feature-settings: 'tnum' on, 'lnum' on;
        font-weight: 500;
      }

      input {
        width: 100%;
        padding: 12px;
        border-radius: 8px;
        color: ${({ theme }) => theme.colors.purple};
        border-width: 1.5px;
        border-color: ${({ theme }) => theme.colors.purple};
        caret-color: ${({ theme }) => theme.colors.purple};
        transition: 200ms border;

        &:focus {
          // border-color: ${({ theme }) => theme.colors.purple};
        }
      }

      margin-bottom: 28px;
    }

    .rate {
      margin: 0 0 24px 0;
      text-align: center;
      font-size: 12px;
      font-weight: 500;
      color: ${({ theme }) => theme.colors['good-green']};
    }

    .table {
      border: 1.5px solid rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      margin-bottom: 37px;

      .tr {
        padding: 17px 24px 13px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        font-weight: bold;
        letter-spacing: 0.1em;

        &:not(:last-of-type) {
          border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        }

        p {
          margin: 0;

          &.th {
            letter-spacing: 10%;
            color: ${({ theme }) => theme.colors.text.secondary.lighter};
          }

          &.td {
            color: ${({ theme }) => theme.colors.text.secondary.light};

            &.big {
              color: ${({ theme }) => theme.colors.text.secondary.main};
              font-size: 14px;
            }
          }
        }
      }
    }
  }
`;

export default {
  components: {
    Dropdown,
    Button,
    SendCoinsContainer,
    Input,
    Spinner,
  },
  data() {
    return {
      fromAmount: 0,
      fromCurrency: undefined,
      toAmount: 0,
      toCurrency: undefined,
      walletAddress: '',
      disableInput: false,
      fee: {},
      fees: {
        fetching: false,
        results: [],
      },
      whatYouGet: 1000000,
      processing: false,
    };
  },
  computed: {
    disabled() {
      return (
        !this.fee ||
        !this.fromCurrency ||
        !this.whatYouGet ||
        !this.walletAddress ||
        this.processing
      );
    },
    list() {
      return cryptos;
    },
    fromCurrencyBalance() {
      const coin = this.wallets.results.find(
        wallet => wallet.currency === assetToSymbol(this.fromCurrency),
      );

      return coin.currency === 'NGN' ? coin.balance / 100 : coin.balance;
    },
    ...mapGetters('wallets', ['wallets']),
  },
  methods: {
    setFromCurrency(currency) {
      this.fromCurrency = currency.name;
    },
    setToCurrency(currency) {
      this.toCurrency = currency.name;
    },
    setFee() {
      this.fee = this.fees.results[assetToSymbol(this.fromCurrency)];
    },
    async sendCoin() {
      this.processing = true;
      try {
        const data = await wallets.sendCrypto({
          currency: assetToSymbol(this.fromCurrency),
          amount: this.fromAmount,
          address: this.walletAddress,
          fee: this.fee.average,
        });

        if (data?.success) {
          this.$emit('dismiss');
        }
      } finally {
        this.processing = false;
      }
    },
    swapAll() {
      this.fromAmount = this.fromCurrencyBalance;
    },
  },
  watch: {
    async fromCurrency(value) {
      this.fees.fetching = true;
      try {
        const data = await wallets.getFee(assetToSymbol(value));
        if (!data.success) return;

        if (data?.success && data.response.success && data.response?.data) {
          this.fees.results = {
            ...this.fees.results,
            [assetToSymbol(value)]: { ...data.response.data },
          };

          await this.setFee();
        }
      } finally {
        this.fees.fetching = false;
      }
    },
  },
};
</script>
