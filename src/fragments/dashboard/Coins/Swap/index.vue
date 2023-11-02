<template>
  <swap-coins-container>
    <form @submit.prevent="handleSubmit">
      <dropdown
        label="From"
        :list="fromList"
        type="number"
        v-model="fromAmount"
        @change="setFromCurrency"
        @input="$emit('setFromAmount', fromAmount)"
        class="dropdown"
      />
      <div class="balance-container" v-if="!wallets.fetching">
        <span class="balance">
          Balance:
          <template v-if="fromCurrency === 'Fiat'">
            {{ fromCurrencyBalance | formatAmount }}
          </template>
          <template v-else>
            {{ fromCurrencyBalance | formatNumber }}
            {{ fromCurrency | assetToSymbol }}
          </template>
        </span>
        <span class="select-all" role="button" @click="swapAll">
          swap all
        </span>
      </div>
      <dropdown
        label="Currency to swap to"
        :list="toList"
        type="tel"
        v-model="toAmount"
        @change="setToCurrency"
        disabled
        class="dropdown"
      />

      <transition-group name="fade">
        <div :key="'quote-container'" v-if="!!quote">
          <div
            style="display: flex; justify-content: space-between"
            v-if="fromCurrency !== 'Fiat'"
          >
            <p class="rate">
              RATE:
              <template v-if="fromCurrency !== 'Fiat' && toCurrency !== 'Fiat'">
                {{ quote.rate }} {{ quote.have }}/ {{ quote.want }}
              </template>
              <template v-else>
                {{ (quote.rate / 100) | formatAmount }}/$
              </template>
            </p>
          </div>
          <div class="table">
            <!--            <div class="tr">-->
            <!--              <p class="th">CHARGES</p>-->
            <!--              <p class="td">-->
            <!--                0.2 {{ fromCurrency ? fromCurrency.code : 'BTC' }}-->
            <!--              </p>-->
            <!--            </div>-->
            <div class="tr">
              <p class="th">YOU GET</p>
              <p class="td big">
                <template v-if="toCurrency === 'Fiat'">
                  {{ (quote.amount / 100) | formatAmount }}
                </template>
                <template v-else>
                  {{ quote.amount }}
                </template>
                <template v-if="toCurrency !== 'Fiat'">
                  {{ toCurrency | assetToSymbol }}
                </template>
              </p>
            </div>
          </div>
        </div>
      </transition-group>
      <div role="radiogroup">
        <check
          v-for="(method, index) in methods"
          :key="method.id"
          :class="{ active: instant === (method.id === 'instant') }"
          role="radio"
          :aria-selected="method.id === chosenMethod"
          @click="instant = method.id === 'instant'"
        >
          <div class="heading">
            <h4 class="title">{{ method.name }}</h4>
            <Radio
              @change="chosenMethod = method.id"
              :index="index + 1"
              name="swap-method"
              :value="method.id"
              :selected="instant === (method.id === 'instant')"
            />
          </div>
          <p>{{ method.description }}</p>
        </check>
      </div>
      <Button :text="!!quote ? 'Swap' : 'Get Quote'" :disabled="disabled" />
    </form>
  </swap-coins-container>
</template>

<script>
import AOS from 'aos';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import styled from 'vue-styled-components';

import { cryptos } from '@/lib';
import {
  assetToSymbol,
  capitalize,
  formatAmount,
  symbolToAsset,
} from '@/helpers';
import { swap } from '@/api';
import { Button, Dropdown, Radio } from '@/components';

const Check = styled.div`
   {
    border: 1.5px solid ${({ theme }) => theme.colors.text.secondary.lighter};
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 24px;
    cursor: pointer;

    &.active {
      border-color: ${({ theme }) => theme.colors.orange};
    }

    .heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;

      .title {
        color: ${({ theme }) => theme.colors.orange};
        margin: 0;
        font-size: 1em;
      }
    }

    p {
      margin: 0;
      font-size: 0.8em;
      line-height: 20px;
      color: ${({ theme }) => theme.colors.text.secondary.light};
    }
  }
`;

const SwapCoinsContainer = styled('article')`
   {
    padding: 22px 0;
    overflow: auto;

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

    .rate {
      margin: 0 0 24px 0;
      text-align: center;
      font-size: 12px;
      font-weight: 600;
      color: ${({ theme }) => theme.colors['good-green']};
    }

    .table {
      border: 1.5px solid ${({ theme }) => theme.colors.text.secondary.lighter};
      border-radius: 8px;
      margin-bottom: 37px;

      .tr {
        padding: 17px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        font-weight: bold;
        letter-spacing: 0.1em;

        &:not(:last-of-type) {
          border-bottom: 1px solid
            ${({ theme }) => theme.colors.text.secondary.lighter};
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
    SwapCoinsContainer,
    Dropdown,
    Radio,
    Check,
    Button,
  },
  data() {
    return {
      fromAmount: 0,
      fromCurrency: undefined,
      toAmount: 0,
      toCurrency: undefined,
      step1: true,
      step2: false,
      processing: false,
      quote: '',
      instant: true,
      chosenMethod: '',
      methods: [
        {
          name: 'Instant swap',
          description: 'Have your swap order fulfilled instantly',
          id: 'instant',
        },
        {
          name: 'Manual swap',
          description: 'Order may take up to 2 hours',
          id: 'manual',
        },
      ],
    };
  },
  computed: {
    fromList() {
      if (this.activeSwapCoin) {
        return [
          {
            name: capitalize(symbolToAsset(this.activeSwapCoin.currency)),
            code: this.activeSwapCoin.currency,
          },
          ...cryptos,
        ];
      }
      return [{ name: 'Fiat', code: 'NGN' }, ...cryptos];
    },
    toList() {
      return [{ name: 'Fiat', code: 'NGN' }, ...cryptos].filter(
        coin => coin.name !== this.fromCurrency,
      );
    },
    disabled() {
      const bDisabled =
        !this.fromCurrency ||
        !this.fromAmount ||
        !this.toCurrency ||
        this.processing;

      if (!this.quote) {
        return bDisabled;
      } else {
        return bDisabled || !this.toAmount;
      }
    },
    fromCurrencyBalance() {
      const coin = this.wallets.results.find(
        wallet => wallet.currency === assetToSymbol(this.fromCurrency),
      );

      return coin.currency === 'NGN' ? coin?.balance / 100 : coin?.balance;
    },
    ...mapGetters('wallets', ['wallets']),
    ...mapGetters('user', ['activeSwapCoin']),
  },
  methods: {
    setFromCurrency(currency) {
      this.fromCurrency = currency.name;
    },
    setToCurrency(currency) {
      this.toCurrency = currency.name;
    },
    setFromAmount(amount) {
      this.fromAmount = amount;
    },
    async getQuote() {
      this.processing = true;
      try {
        const data = await swap.getQuote({
          amount: this.fromAmount,
          have: assetToSymbol(this.fromCurrency),
          want: assetToSymbol(this.toCurrency),
          instant: this.instant,
        });

        if (data?.success) {
          this.quote = data.response;

          if (assetToSymbol(this.toCurrency) === 'NGN') {
            this.toAmount = formatAmount(data.response.amount / 100);
          } else {
            this.toAmount = data.response.amount;
          }
        }
      } finally {
        this.processing = false;
      }
    },
    async finish() {
      this.processing = true;

      try {
        const data = await swap.createRequest({
          want: assetToSymbol(this.toCurrency),
          amount: this.fromAmount,
          have: assetToSymbol(this.fromCurrency),
          swapQuote: this.quote.id,
          instant: this.instant,
        });

        if (data?.success) {
          this.$emit('dismiss');

          await Promise.all([
            this.fetchSwaps(),
            this.fetchWallets(),
            this.getMonkeyboard(),
          ]);

          await AOS.init();

          await this.$toast.success('Swap request created');
        }
      } finally {
        this.processing = false;
      }
    },
    async handleSubmit() {
      if (!this.quote) {
        await this.getQuote();
      } else {
        await this.finish();
      }
    },
    swapAll() {
      this.fromAmount = this.fromCurrencyBalance;
    },
    ...mapActions('swaps', ['fetchSwaps']),
    ...mapActions('wallets', ['fetchWallets']),
    ...mapMutations('user', ['setActiveSwapCoin']),
    ...mapActions('monkeyboard', ['getMonkeyboard']),
  },
  watch: {
    fromCurrency() {
      this.fromAmount = '';
      this.toAmount = '';
      this.quote = '';
    },
    async toCurrency() {
      this.toAmount = '';

      if (this.fromAmount) {
        await this.getQuote();
      }
    },
    instant() {
      this.quote = '';
      this.toAmount = '';
    },
    fromAmount() {
      this.quote = '';
      this.toAmount = '';
    },
    toList(value) {
      this.toCurrency = value[0].name;
    },
  },
  mounted() {
    if (this.activeSwapCoin)
      this.fromCurrency = capitalize(
        symbolToAsset(this.activeSwapCoin?.currency),
      );
    else this.toCurrency = 'Bitcoin';
  },
};
</script>
