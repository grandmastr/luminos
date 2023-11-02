<template>
  <swaps-card>
    <Details :providersOpen="providersOpen">
      <div class="header-container">
        <back role="button" @click="$emit('close')" class="back-button" />
        <h3>Swap details</h3>
      </div>
      <div class="details-container">
        <div class="merged-row">
          <span class="type">
            <span
              aria-label="status"
              :class="[swap.completed ? 'fulfilled' : 'pending']"
            />{{ swap.instant ? 'instant' : 'manual' }}
            swap
          </span>
          <span :class="[swap.completed ? 'fulfilled' : 'pending', 'status']">
            <template v-if="swap.completed"> Fulfilled </template>
            <template v-else> Pending </template>
          </span>
        </div>
        <hr />
        <div class="detail-row">
          <h3>currencies</h3>
          <div>
            <div class="merged-row no-m">
              <span aria-label="currencies" class="currencies"
                >{{ swap.have | symbolToAsset | capitalize }}
                <span>({{ swap.have }})</span> -
                {{ swap.want | symbolToAsset | capitalize }}
                <span>({{ swap.want }})</span></span
              >
            </div>
            <div class="coin-images">
              <component :is="swap.have | symbolToAsset" class="have-coin" />
              <component :is="swap.want | symbolToAsset" class="want-coin" />
            </div>
          </div>
        </div>
        <hr class="m-5" />
        <div class="detail-row m-5">
          <div class="merged-row no-m">
            <div class="column">
              <h3>from</h3>
              <span aria-label="swapping from" class="swap-values">
                <template v-if="swap.have === 'NGN'">
                  {{ (swap.amount / 100) | formatAmount }}
                </template>
                <template v-else> {{ swap.amount }} {{ swap.have }} </template>
              </span>
            </div>
          </div>
        </div>
        <hr />
        <!--        <div class="merged-row conversion">-->
        <!--          <span class="conversion-title"> conversion rate </span>-->
        <!--          <span class="conversion-rate"> {{ 365 | formatAmount }}/$ </span>-->
        <!--        </div>-->
        <!--        <hr />-->
        <div
          class="merged-row conversion accordion"
          role="button"
          aria-expanded="false"
          aria-controls="#accordionContent"
          id="providersButton"
          aria-label="see providers"
          @click="providersOpen = !providersOpen"
        >
          <span class="conversion-title"> order fulfilled by </span>
          <i data-feather="chevron-down" />
        </div>
        <transition name="fade">
          <template v-if="providersOpen">
            <div
              class="accordion-content"
              id="accordionContent"
              aria-labelledby="#providersButton"
            >
              <div class="merged-row">
                <span>@grandmaster</span>
                <span>0.0005<small>BTC</small> </span>
              </div>
            </div>
          </template>
        </transition>
        <template v-if="swap.instant">
          <cancel-request-button
            :disabled="processing"
            @click="cancelTransaction"
          >
            <div>
              <cancel-icon class="cancel-icon" />
              <span> Cancel Order </span>
            </div>
          </cancel-request-button>
        </template>
      </div>
    </Details>
  </swaps-card>
</template>

<script>
import AOS from 'aos';
import styled, { css } from 'vue-styled-components';
import feather from 'feather-icons';
import { lighten } from 'polished';

import { Button, Card } from '@/components';
import {
  Back,
  Bitcoin,
  CancelIcon,
  Dash,
  Doge,
  Ethereum,
  Fiat,
  Litecoin,
  Tether,
  Tron,
} from '@/assets';
import { query } from '@/helpers';
import { wallets } from '@/api';

const swapCardProps = {
  fetching: {
    type: Boolean,
    default() {
      return false;
    },
  },
};

const SwapsCard = styled(Card, swapCardProps)`
  max-height: 680px;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  ${query.maxWidth('medium')`
    max-height: 640px;
  `};

  div.spinner-container1 {
    height: 100%;

    > div {
      position: relative;
      top: 45%;
    }
  }
`;

// eslint-disable-next-line no-unused-vars
const CancelRequestButton = styled(Button)`
  position: absolute;
  bottom: 0;
  background-color: transparent;
  border: none;
  border-top: 1px solid rgba(12, 16, 58, 0.1);

  &:hover {
    background-color: ${({ theme }) => lighten(0.25, theme.colors['bad-red'])};
  }

  * {
    align-self: center;
  }

  .cancel-icon {
    margin-right: 8px;
  }

  span {
    position: relative;
    top: 2px;
    color: ${({ theme }) => theme.colors['bad-red']};
    font-weight: 500;
    font-size: 0.875em;
  }

  > div {
    display: flex;
    place-items: center;
  }
`;

const DetailsProps = {
  providersOpen: Boolean,
};

const Details = styled('div', DetailsProps)`
  height: 100%;
  position: relative;

  div.coin-images {
    position: relative;
    top: -12px;

    * {
      transition: 200ms ease-in-out transform;
    }

    .have-coin {
      &:hover {
        ~ * {
          transform: translateX(0);
        }
      }
    }

    .want-coin {
      transform: translateX(-10px);
    }
  }

  div.accordion-content {
    padding-top: 1em;

    .merged-row {
      span {
        font-weight: 500;
        font-size: 0.8em;
      }

      span:first-child {
        color: ${({ theme }) => theme.colors.ongoing};
      }

      span:nth-child(2) {
        color: ${({ theme }) => theme.colors['tinted-blue']};
        font-variant: small-caps;
        font-feature-settings: 'tnum' on, 'lnum' on;
      }
    }
  }

  .edit {
    position: relative;
    top: -0.75em;
  }

  &.menu-inactive {
    opacity: 1;
    transform: translateX(0);
  }

  div.merged-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    svg {
      color: rgba(46, 49, 146, 0.4);
      height: 16px;
      width: 16px;
      align-self: center;
      transition: 200ms ease-in-out transform;

      ${({ providersOpen }) =>
        providersOpen &&
        css`
          transform: rotate(180deg);
        `};
    }

    &:not(.no-m) {
      padding: 0 1.2em 0.4em;
    }

    &.conversion {
      padding: 0.6em 1.2em;
    }
  }

  div.detail-row {
    padding: 0.05em 1.2em 0;

    &.m-5 {
      padding-top: 0.8em;
    }

    > div {
      display: flex;
      justify-content: space-between;
      position: relative;
      top: -12px;
      margin: 0;
    }

    h3 {
      color: ${({ theme }) => theme.colors['tinted-blue']};
      font-weight: 500;
      font-size: 0.9em;
      font-variant: small-caps;
      font-feature-settings: 'tnum' on, 'lnum' on;
    }
  }

  span.swap-values {
    color: ${({ theme }) => theme.colors['dark-blue']};
    font-weight: 600;
    font-size: 0.875em;
    position: relative;
    top: -4px;
  }

  span.type,
  span.conversion-title {
    color: ${({ theme }) => theme.colors['tinted-blue']};
    font-size: 0.9em;
    font-weight: 500;
    font-variant: small-caps;
    font-feature-settings: 'tnum' on, 'lnum' on;
    display: inline-flex;
    place-items: center;

    span[aria-label] {
      display: inline-block;
      height: 5px;
      width: 5px;
      border-radius: 50%;
      margin-right: 9px;

      &.fulfilled {
        background-color: ${({ theme }) => theme.colors.orange};
      }

      &.pending {
        background-color: ${({ theme }) => theme.colors.purple};
      }
    }
  }

  span.status,
  span.conversion-rate {
    display: inline-block;
    padding: 0.4em 0.6em 0.3em;
    border-radius: 8px;
    font-size: 0.8em;

    &.fulfilled {
      color: ${({ theme }) => theme.colors['good-green']};
      background-color: ${({ theme }) =>
        lighten(0.45, theme.colors['good-green'])};
    }

    &.pending {
      color: ${({ theme }) => theme.colors.orange};
      background-color: ${({ theme }) => lighten(0.45, theme.colors.orange)};
    }
  }

  span.conversion-rate {
    color: ${({ theme }) => theme.colors['pale-purple']};
    background-color: ${({ theme }) =>
      lighten(0.35, theme.colors['pale-purple'])};
    font-weight: 600;
  }

  span.currencies {
    font-size: 0.875em;
    font-weight: 500;
    color: ${({ theme }) => theme.colors['dark-blue']};

    > span {
      color: ${({ theme }) => theme.colors['tinted-blue']};
    }
  }

  div.header-container {
    margin-bottom: 1.5em;
    display: flex;
    flex-direction: row;
    align-items: center;

    .back-button {
      margin-right: 1.25em;
    }

    h3 {
      color: ${({ theme }) => theme.colors.purple};
      font-family: ${({ theme }) => theme.fontFamily('Fraunces')};
      margin: 0;
    }
  }

  div.clear {
    height: 1.25em;
    clear: both;
  }

  div.details-container {
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 8px;
    padding: 1em 0 0.1em 0;
    height: calc(100% - 55px);

    &.second {
      margin-top: 1.5em;
    }

    hr {
      border: 1px solid rgba(12, 16, 58, 0.1);

      &.m-5 {
        margin-top: -2px;
      }
    }

    div.row {
      display: flex;
      flex-direction: column;
      padding: 0 1.2em 0.3em 1.2em;

      &.email {
        padding-top: 0.6em;
      }

      span.title {
        font-weight: 500;
        font-size: 0.75em;
        font-variant: small-caps;
        letter-spacing: 0.1em;
        color: ${({ theme }) => theme.colors.text.secondary.lighter};
        margin-bottom: 0.75em;
      }

      span.value {
        font-weight: 500;
        font-size: 0.8em;
        color: ${({ theme }) => theme.colors['dark-blue']};
        font-feature-settings: 'tnum' on, 'lnum' on;
      }
    }
  }
`;

export default {
  name: 'SwapDetails',
  data() {
    return {
      providersOpen: false,
      fetchingProviders: false,
      processing: false,
    };
  },
  components: {
    SwapsCard,
    Details,
    Back,
    CancelRequestButton,
    CancelIcon,
    Bitcoin,
    Tether,
    Fiat,
    Ethereum,
    Litecoin,
    Dash,
    Doge,
    Tron,
  },
  async mounted() {
    feather.replace();

    await this.getProviders();

    // eslint-disable-next-line no-unused-expressions
    AOS?.init();
  },
  computed: {
    pending() {
      return this.swaps.results.filter(
        swap => !(swap?.amount - swap?.left_amount) && !swap?.completed,
      );
    },
    ongoing() {
      return this.swaps.results.filter(
        swap => !!swap?.left_amount && !!(swap?.amount - swap?.left_amount),
      );
    },
    fulfilled() {
      return this.swaps.results.filter(swap => swap?.completed);
    },
  },
  props: {
    swap: Object,
  },
  methods: {
    changeTab(data) {
      this.activeTab = data;
    },
    async getSwaps() {
      await this.fetchSwaps();
    },
    openPoolDetails() {
      this.$emit('openPoolDetails');
    },
    async getProviders() {
      this.fetchingProviders = true;
      try {
        const data = await wallets.getTransactionProviders({
          swapRequestRef: this.swap?.ref,
        });

        if (data?.success) {
          console.log(data.response);
        }
      } finally {
        this.fetchingProviders = false;
      }
    },
    async cancelTransaction() {
      this.processing = true;
      try {
        const data = await wallets.cancelTransaction({
          swapRequestRef: this.swap?.ref,
        });

        if (data?.success) {
          console.log(data.response);
        }
      } finally {
        this.processing = false;
      }
    },
  },
};
</script>
