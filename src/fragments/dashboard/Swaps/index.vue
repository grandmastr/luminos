<template>
  <swaps-card :fetching="swaps.fetching || pool.fetching">
    <!--    <template v-if="user.account_type === 'POOL_PROVIDER'">-->
    <!--      <div class="pool-balance__container">-->
    <!--        <template v-if="pool.fetching">-->
    <!--          <div class="spinner-container1">-->
    <!--            <spinner size="small" />-->
    <!--          </div>-->
    <!--        </template>-->
    <!--        <template v-else>-->
    <!--          <div>-->
    <!--            <h4>pool balance</h4>-->
    <!--            <div>-->
    <!--              <span class="amount">-->
    <!--                <template v-if="hideBalance"> ******* </template>-->
    <!--                <template v-else>-->
    <!--                  {{ poolTotalCurrentBalance | formatAmount }}-->
    <!--                </template>-->
    <!--              </span>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--          <hr />-->
    <!--          <div class="pool-balance__details">-->
    <!--            <div class="currencies">-->
    <!--              <component v-for="coin in stash" :key="coin" :is="coin" />-->
    <!--            </div>-->
    <!--            <span role="button" @click="openPoolDetails"-->
    <!--              >More details <i data-feather="chevron-right" style="top: 0"-->
    <!--            /></span>-->
    <!--          </div>-->
    <!--        </template>-->
    <!--      </div>-->
    <!--    </template>-->
    <tabs @tabClick="changeTab" :tabs="tabs" default="2" />
    <div class="container">
      <div class="swap-transactions__container">
        <template v-if="swaps.fetching">
          <div class="spinner-container">
            <spinner size="small" />
          </div>
        </template>
        <template v-else>
          <template v-if="activeTab.id === 'PENDING'">
            <div>
              <template v-if="pending.length">
                <swap-transaction
                  v-for="(swap, index) in pending"
                  :key="index"
                  :swap="swap"
                />
              </template>
              <template v-else>
                <div class="empty-container">
                  <empty type="pending" />
                </div>
              </template>
            </div>
          </template>
          <template v-else-if="activeTab.id === 'ONGOING'">
            <div>
              <template v-if="ongoing.length">
                <swap-transaction
                  v-for="(swap, index) in ongoing"
                  :key="index"
                  :swap="swap"
                />
              </template>
              <template v-else>
                <div class="empty-container">
                  <empty type="ongoing" />
                </div>
              </template>
            </div>
          </template>
          <template v-else>
            <div>
              <template v-if="fulfilled.length">
                <swap-transaction
                  v-for="(swap, index) in fulfilled"
                  :key="index"
                  :swap="swap"
                  @click="transactionClick"
                />
              </template>
              <template v-else>
                <div class="empty-container">
                  <empty type="fulfilled" />
                </div>
              </template>
            </div>
          </template>
        </template>
      </div>
    </div>
    <transition name="slide">
      <swap-details
        v-if="details.show"
        @close="details.show = false"
        :swap="details.results"
      />
    </transition>
  </swaps-card>
</template>

<script>
import Vue from 'vue';
import AOS from 'aos';
import styled, { css } from 'vue-styled-components';
import { mapActions, mapGetters } from 'vuex';

import SwapTransaction from './SwapTransaction';
import { Button, Card, Empty, Spinner, Tabs } from '@/components';
import { query } from '@/helpers';
import store from '@/store';

const accountType = store.getters['user/user']?.account_type;

// eslint-disable-next-line no-unused-vars
const StyledButton = styled(Button)`
  width: 180px;
  padding: 0 0 0 1.25em;
  height: 58px;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  font-size: 0.8em;
  align-self: center;

  > div:nth-child(2) {
    background-color: rgba(0, 0, 0, 0.2);
    height: 100%;
    width: 2.5em;
    display: grid;
    place-items: center;
    padding: 0 0.5em;

    svg {
      color: ${({ theme }) => theme.colors.orange};
      height: 14px;
    }
  }
`;

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
  position: relative;

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

  div.empty-container {
    height: ${accountType === 'POOL_PROVIDER' ? '360px' : '540px'};
    display: flex;
    place-items: center;
    overflow-y: hidden;
  }

  div.pool-balance__container {
    margin-bottom: 2.25em;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.white};
    padding-bottom: 1.2em;
    height: 150px;

    div.pool-balance__details {
      display: flex;
      justify-content: space-between;
      align-items: center;

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

      span {
        display: flex;
        align-items: center;
        color: ${({ theme }) => theme.colors.purple};
        font-weight: 500;
        font-size: 0.875em;

        svg {
          color: ${({ theme }) => theme.colors.orange};
          height: 14px;
          align-self: center;
          position: relative;
          left: -2px;
          top: -2px;
        }
      }
    }

    hr {
      border: 1px solid rgba(12, 16, 58, 0.1);
    }

    > div {
      padding: 0.4em 1.2em 0 1.2em;
    }

    > div:first-child {
      font-variant: small-caps;

      h4 {
        color: ${({ theme }) => theme.colors.text.secondary.lighter};
        font-size: 0.75em;
        font-weight: 500;
        margin-bottom: 12px;
      }

      > div {
        margin-bottom: 1em;

        span.amount {
          margin-top: 0;
          color: ${({ theme }) => theme.colors.purple};
          font-size: 1em;
          font-weight: 600;
        }

        span.gr {
          margin-top: 0;
          color: ${({ theme }) => theme.colors['good-green']};
          font-size: 0.75em;
          font-weight: 500;
          margin-left: 9px;
        }
      }
    }
  }

  div.container {
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: ${({ theme }) => theme.colors.white};
    height: max(100%, calc(100% - 150px));
    overflow-y: auto;
    border-radius: 8px;

    &.provider {
      display: grid;
      place-items: center;
      place-content: center;
      height: 200px;
      margin-bottom: 2em;

      ${query.minWidth('>large1')`
        display: none;
      `}
    }

    &::-webkit-scrollbar {
      width: 0;
      background: transparent;
      display: none;
    }

    div.spinner-container {
      display: grid;
      place-items: center;
      overflow-y: hidden;
      height: calc(600px - 240px);
    }

    div.swap-transactions__container {
      padding: 0 1.2em;

      ${({ fetching }) =>
        fetching &&
        css`
          height: 100%;
          display: grid;
          place-content: center;
        `};
    }


    div.row {
      position: relative;

      svg {
        transition: transform ease-in-out 200ms;
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

      &:first-child {
        padding: 1.2em 0 0 0;

        div.coin-images {
          color: ${({ theme }) => theme.colors.text.secondary.light};
          position: absolute;
          right: -5px;
          top: 30%;
        }
      }

      &:not(:first-child) {
        padding-top: 0.3em;
        margin-top: 0;
      }

      div.coin-images {
        color: ${({ theme }) => theme.colors.text.secondary.light};
        position: absolute;
        right: -5px;
        top: 5%;
      }

      > span {
        display: block;
        font-feature-settings: 'tnum' on, 'lnum' on;
        margin-bottom: 10px;
      }

      span:first-child {
        color: ${({ theme }) => theme.colors.text.secondary.light};
        font-size: 0.8em;
        font-weight: 500;
      }

      span:nth-child(2) {
        color: ${({ theme }) => theme.colors['dark-blue']};
        font-weight: 600;
        font-size: 0.8em;

        span {
          font-weight: 600;
          font-size: 1em;
          position: relative;
          top: -1px;

          &.PENDING {
            color: ${({ theme }) => theme.colors.orange};
          }

          &.FULFILLED {
            color: ${({ theme }) => theme.colors['good-green']}
          }

          &.ONGOING {
            color: ${({ theme }) => theme.colors.ongoing}
          }
        }
      }

      hr {
        border: 1px solid rgba(12, 16, 58, 0.1);
        margin: 1em 0;
      }
    }
  }

  .chevron {
    color: ${({ theme }) => theme.colors.orange};
    margin-left: 14.06px;
  }

  span.percentage {
    color: ${({ theme }) => theme.colors.ongoing};
    font-size: 0.75em;
    font-weight: 500;
  }
}
`;

const SwapDetails = Vue.component('swap-details', () =>
  import('@/fragments/dashboard/Swaps/SwapDetails'),
);

export default {
  name: 'Swaps',
  data() {
    return {
      activeTab: Object.create({}),
      tabs: [
        { title: 'Pending', id: 'PENDING' },
        { title: 'Ongoing', id: 'ONGOING' },
        { title: 'Fulfilled', id: 'FULFILLED' },
      ],
      fetchingPool: false,
      details: {
        show: false,
        results: null,
      },
    };
  },
  components: {
    SwapsCard,
    Tabs,
    SwapTransaction,
    Spinner,
    Empty,
    SwapDetails,
  },
  async mounted() {
    await this.getSwaps();

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
    ...mapGetters('swaps', ['swaps']),
    ...mapGetters('user', ['user', 'hideBalance']),
    ...mapGetters('pool', [
      'pool',
      'poolTotalStartBalance',
      'poolTotalCurrentBalance',
      'poolRate',
      'stash',
    ]),
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
    transactionClick(swap) {
      this.details = {
        show: true,
        results: swap,
      };
    },
    ...mapActions('swaps', ['fetchSwaps']),
    ...mapActions('pool', ['getPoolDetails']),
  },
};
</script>
