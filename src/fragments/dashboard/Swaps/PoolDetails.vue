<template>
  <pool-details-container>
    <template v-if="pool.fetching">
      <div class="spinner-container">
        <spinner size="small" />
      </div>
    </template>
    <template v-else>
      <div class="column">
        <span class="title"> pool balance </span>
        <div>
          <span class="value">{{
            poolTotalCurrentBalance | formatAmount
          }}</span>
          <!--          <span class="rate">+{{ poolRate }}%</span>-->
        </div>
      </div>
      <hr />
      <!--      <div class="column">-->
      <!--        <span class="title"> total swaps fulfilled </span>-->
      <!--        <div>-->
      <!--          <span class="value badge">-->
      <!--            {{ fulfilledSwaps }}-->
      <!--          </span>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <hr />-->
      <div class="column">
        <span class="title"> stash </span>
        <div>
          <div class="currencies">
            <component v-for="coin in stash" :key="coin" :is="coin" />
          </div>
          <ul class="currency-li">
            <li v-for="coin in stash" :key="coin">{{ coin }}</li>
          </ul>
        </div>
      </div>
    </template>
  </pool-details-container>
</template>

<script>
import { mapGetters } from 'vuex';
import styled from 'vue-styled-components';

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
import { Spinner } from '@/components';

const PoolDetailsContainer = styled('article')`
  padding: 0.8em 0;

  div.spinner-container {
    height: 240px;
    display: grid;
    place-items: center;
  }

  hr {
    border: 1px solid rgba(12, 16, 58, 0.1);
  }

  div.column {
    div.currencies {
      margin-bottom: 10px;

      svg {
        transition: transform ease-in-out 200ms;

        &:first-child {
          &:hover {
            ~ * {
              transform: translateX(0);
            }
          }
        }

        &:nth-child(2) {
          transform: translateX(-10px);

          &:hover {
            ~ * {
              transform: translateX(-10px);
            }
          }
        }

        &:nth-child(3) {
          transform: translateX(-20px);

          &:hover {
            ~ * {
              transform: translateX(-20px);
            }
          }
        }

        &:nth-child(4) {
          transform: translateX(-30px);

          &:hover {
            ~ * {
              transform: translateX(-30px);
            }
          }
        }

        &:nth-child(5) {
          transform: translateX(-40px);

          &:hover {
            ~ * {
              transform: translateX(-40px);
            }
          }
        }

        &:nth-child(6) {
          transform: translateX(-50px);

          &:hover {
            ~ * {
              transform: translateX(-50px);
            }
          }
        }

        &:nth-child(7) {
          transform: translateX(-60px);

          &:hover {
            ~ * {
              transform: translateX(-60px);
            }
          }
        }

        &:nth-child(8) {
          transform: translateX(-70px);

          &:hover {
            ~ * {
              transform: translateX(-70px);
            }
          }
        }
      }
    }

    ul {
      display: flex;

      li {
        color: ${({ theme }) => theme.colors.purple};
        text-transform: uppercase;
        font-variant: small-caps;
        font-size: 0.75em;
        font-weight: 500;
        letter-spacing: 0.1em;

        &:not(:last-child) {
          margin-right: 3px;

          &::after {
            content: ',';
          }
        }
      }
    }

    span.title {
      font-size: 0.75em;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.text.secondary.lighter};
      letter-spacing: 0.1em;
      font-variant: small-caps;
      font-feature-settings: 'tnum' on, 'lnum' on;
      display: inline-block;
      margin-bottom: 0.75em;
    }

    > div {
      margin-bottom: 1em;
    }

    span.value {
      color: ${({ theme }) => theme.colors.purple};
      font-weight: 600;
      font-size: 1em;

      &.badge {
        background-color: ${({ theme }) => theme.colors['badge-background']};
        padding: 6px 8px;
        border-radius: 8px;
        color: ${({ theme }) => theme.colors['dark-blue']};
        font-size: 0.78em;
        font-weight: 500;
      }
    }

    span.rate {
      margin-left: 0.5em;
      font-size: 0.75em;
      color: ${({ theme }) => theme.colors['good-green']};
      font-weight: 500;
    }
  }
`;

export default {
  name: 'PoolDetails',
  data() {
    return {
      fulfilledSwaps: '0',
      fetching: false,
    };
  },
  components: {
    PoolDetailsContainer,
    // eslint-disable-next-line vue/no-unused-components
    Bitcoin,
    // eslint-disable-next-line vue/no-unused-components
    Fiat,
    // eslint-disable-next-line vue/no-unused-components
    Tether,
    // eslint-disable-next-line vue/no-unused-components
    Ethereum,
    // eslint-disable-next-line vue/no-unused-components
    Litecoin,
    // eslint-disable-next-line vue/no-unused-components
    Doge,
    // eslint-disable-next-line vue/no-unused-components
    Tron,
    // eslint-disable-next-line vue/no-unused-components
    Dash,
    Spinner,
  },
  computed: {
    ...mapGetters('pool', [
      'pool',
      'poolTotalCurrentBalance',
      'poolRate',
      'stash',
    ]),
  },
};
</script>
