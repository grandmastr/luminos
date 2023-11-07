<template>
  <card>
    <container :fetching="wallets.fetching">
      <div>
        <div class="action-container">
          <div class="button" role="button" @click="openDepositModal">
            <div class="icon-container arrow-down-left">
              <i data-feather="arrow-down-left" class="arrow-down-left" />
            </div>
            <span> Deposit </span>
          </div>
          <!--          <div class="divider" />-->
          <!--          <div class="button" role="button" @click="openSendCoinModal">-->
          <!--            <div class="icon-container arrow-up-right">-->
          <!--              <i data-feather="arrow-up-right" />-->
          <!--            </div>-->
          <!--            <span> Send </span>-->
          <!--          </div>-->
        </div>
        <hr />
      </div>

      <div class="swap-content__container">
        <template v-if="wallets.fetching">
          <div class="spinner-container">
            <spinner />
          </div>
        </template>
        <template v-else>
          <div class="coin-balance__container">
            <template v-if="!!yourCoins.length">
              <div class="your-coins">
                <div class="coin-shalaye">
                  <h5>your coins</h5>
                  <span role="button" @click="setHideBalance(!hideBalance)">
                    {{ hideBalance ? 'Show' : 'Hide' }}
                    Balance
                    <eye v-if="hideBalance" class="eye" />
                    <eye-off v-else-if="!hideBalance" class="eye" />
                  </span>
                </div>
                <div class="coin-dets__container">
                  <div
                    class="row"
                    v-for="coin in yourCoins"
                    :key="coin.asset"
                    role="button"
                    @click="openSwapModal(coin)"
                  >
                    <div class="box">
                      <component :is="coin.asset | symbolToAsset" />
                      <span>
                        {{ coin.asset | symbolToAsset | capitalize }}
                        <span>({{ coin.asset }})</span>
                      </span>
                    </div>
                    <template v-if="hideBalance">
                      <span class="amount"> ****** </span>
                    </template>
                    <template v-else>
                      <span class="amount" v-if="coin.currency === 'NGN'"
                        >{{ (coin.available_balance / 100) | formatAmount }}
                      </span>
                      <span class="amount" v-else>
                        {{ coin.available_balance | formatNumber }}</span
                      >
                    </template>
                  </div>
                </div>
              </div>
            </template>
            <template v-if="!!fiatCoins.length">
              <div class="other-coins">
                <div class="coin-dets__container t-padding">
                  <div
                    class="row"
                    v-for="coin in fiatCoins"
                    :key="coin.currency"
                    role="button"
                    @click="openSwapModal(coin)"
                  >
                    <div class="box">
                      <component :is="coin.currency | symbolToAsset" />
                      <span>
                        {{ coin.currency | symbolToAsset | capitalize }}
                        <span>({{ coin.currency }})</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-if="!!otherCoins.length">
              <div class="other-coins">
                <h5>{{ !!yourCoins.length ? 'other coins' : 'coins' }}</h5>
                <div class="coin-dets__container">
                  <div
                    class="row"
                    v-for="coin in otherCoins"
                    :key="coin.currency"
                    role="button"
                    @click="openSwapModal(coin)"
                  >
                    <div class="box">
                      <component :is="coin.asset | symbolToAsset" />
                      <span>
                        {{ coin.asset | symbolToAsset | capitalize }}
                        <span>({{ coin.asset }})</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
        <template v-if="isDesktop">
          <div class="swap-container">
            <hr />
            <div>
              <styled-button
                size="default"
                state="primary"
                @click="openSwapModal"
                :disabled="wallets.fetching"
              >
                <!--                <div class="monkey" aria-hidden="true">-->
                <!--                  <img :src="monkey" alt="monkey" />-->
                <!--                </div>-->
                <span>
                  Swap now
                  <i data-feather="chevron-right" class="chevron-right"></i>
                </span>
              </styled-button>
            </div>
          </div>
        </template>
      </div>
    </container>
    <template v-if="isMobile">
      <floating-button
        role="button"
        aria-label="create swap"
        @click="$emit('openSwapModal')"
      >
        <div class="button-label"><span> Swap now </span></div>
        <!--        <div class="monkey">-->
        <!--          <img :src="require('@/assets/avatars/1.webp')" alt="lumino" />-->
        <!--        </div>-->
      </floating-button>
    </template>
  </card>
</template>

<script>
import feather from 'feather-icons';
import styled from 'vue-styled-components';
import { mapActions, mapGetters, mapMutations } from 'vuex';

import { Button, Card, Spinner } from '@/components';
import {
  Bitcoin,
  Dash,
  Doge,
  Earn,
  Ethereum,
  Eye,
  EyeOff,
  Fiat,
  Litecoin,
  Tether,
  Tron,
  Stellar,
} from '@/assets';
import { BOTTOM_NAVIGATION_HEIGHT } from '@/constants';
import { query, toPx } from '@/helpers';

const FloatingButton = styled('div')`
  position: fixed;
  bottom: ${toPx(BOTTOM_NAVIGATION_HEIGHT + 22)};
  right: 24px;
  height: 48px;
  display: grid;
  place-items: center;
  grid-auto-flow: column;

  div.button-label {
    background-color: ${({ theme }) => theme.colors.purple};
    padding: 8px 12px 8px 16px;
    position: relative;
    left: 12px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    box-shadow: 0 4px 20px 1px rgba(0, 0, 0, 0.1);

    span {
      color: ${({ theme }) => theme.colors.white};
      font-weight: 500;
      font-size: 14px;
      font-feature-settings: 'tnum' on, 'lnum' on;
    }
  }

  div.monkey {
    height: 60px;
    width: 60px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.purple};
    padding: 12px;
    box-shadow: 0 4px 20px 1px rgba(0, 0, 0, 0.1);
  }
`;

FloatingButton.name = 'FloatingActionButton';

const StyledButton = styled(Button)`
  padding: 0;
  height: 54px;
  position: relative;
  top: 18px;
  overflow: hidden;
  padding-left: 2rem;

  div.monkey {
    padding: 12px 20px;
    background-color: rgba(0, 0, 0, 0.2);
    margin-right: 15px;

    img {
      height: 27.84px;
      width: 30.96px;
    }
  }

  span {
    display: flex;
    align-items: center;
    font-size: 0.875em;

    svg {
      color: ${({ theme }) => theme.colors.orange};
      margin-left: 16px;
    }
  }
`;

const cardProps = {
  fetching: {
    type: Boolean,
    required: false,
    default() {
      return false;
    },
  },
};

const Container = styled(Card, cardProps)`
  padding: 0;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: none;
  position: relative;

  &.white-card {
    margin-bottom: 24px;
  }

  div.pool-mobile__container {
    padding: 0.8em 0.875em;

    .earn-svg {
      width: 56.17px;
      height: 72.47px;
    }

    h3 {
      margin: 0;
      font-style: normal;
      font-weight: 500;
      font-size: 0.8em;
      letter-spacing: 0.1em;
      font-variant: small-caps;
      font-feature-settings: 'tnum' on, 'lnum' on;
      color: ${({ theme }) => theme.colors.text.secondary.light};
    }

    p {
      font-family: ${({ theme }) => theme.fontFamily('Fraunces')};
      font-weight: 600;
      font-size: 1.25em;
      color: ${({ theme }) => theme.colors.purple};
      margin: 4px 0 0 0;
    }

    span {
      color: ${({ theme }) => theme.colors.purple};
      font-size: 0.875em;
      font-weight: 500;
      display: flex;
      width: auto;
      align-items: center;
      margin-top: 18px;
      margin-bottom: 12px;

      svg {
        stroke: ${({ theme }) => theme.colors.orange};
        height: 16px;
        width: 16px;
        margin-left: 2px;
      }
    }
  }

  div.coin-shalaye {
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      color: ${({ theme }) => theme.colors.purple};
      font-feature-settings: 'tnum' on, 'lnum' on;
      font-weight: 500;
      font-size: 0.875em;
      user-select: none;
    }

    .eye {
      color: ${({ theme }) => theme.colors.orange};
      height: 15px;
      width: 15px;
      align-self: center;
      position: relative;
      top: 3px;
      margin-left: 2px;
    }
  }

  div.action-container {
    height: 60px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    position: relative;
    top: 5px;

    div.divider {
      height: 30px;
      border: 1px solid rgba(12, 16, 58, 0.1);
      position: absolute;
      align-self: center;
    }

    div.button {
      display: flex;
      place-items: center;
      place-content: center;

      div.icon-container {
        display: grid;
        place-items: center;
        place-content: center;
        height: 28px;
        width: 28px;
        border-radius: 4px;
        color: ${({ theme }) => theme.colors.white};
        margin-right: 12px;

        &.arrow-down-left {
          background-color: ${({ theme }) => theme.colors.purple};
        }

        &.arrow-up-right {
          background-color: ${({ theme }) => theme.colors.orange};
        }
      }

      span {
        color: ${({ theme }) => theme.colors.purple};
        font-size: 0.8em;
      }
    }
  }

  hr {
    border: 1px solid rgba(12, 16, 58, 0.1);
  }

  div.swap-content__container {
    height: calc(100% - 78px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    transition: 400ms height ease-in-out;

    div.spinner-container {
      height: calc(480px - 80px);
      display: grid;
      place-items: center;
    }

    ${query.maxWidth('large1')`
      height: 100%;
      overflow-y: auto !important;
    `};
  }

  div.swap-container {
    height: 122px;
    bottom: 0;

    > div {
      display: grid;
      place-items: center;
      place-content: center;
    }

    button.swap-button {
      height: 48px;
    }
  }

  div.coin-balance__container {
    padding: 0 1em;
    max-height: 400px;
    overflow-y: auto;

    ${query.maxWidth('large1')`
      max-height: ${toPx(window.screen.height)};
      height: 100%;
    `};

    &::-webkit-scrollbar {
      width: 0;
      background: transparent;
      display: none;
    }

    h5 {
      color: ${({ theme }) => theme.colors.text.secondary.lighter};
      font-variant: small-caps;
      font-feature-settings: 'tnum' on, 'lnum' on;
      font-weight: 500;
    }

    div.your-coins,
    div.other-coins {
      div.row {
        margin-bottom: 1rem;
        display: grid;
        grid-template-columns: 2fr 1fr;

        span.amount {
          color: ${({ theme }) => theme.colors.text.secondary.light};
          place-self: center;
          font-size: 0.78em;
          font-weight: 600;
          justify-self: end;
        }

        div.box {
          display: flex;
          align-items: center;

          svg {
            margin-right: 12.31px;
          }

          > span {
            font-weight: 500;
            color: ${({ theme }) => theme.colors['dark-blue']};
            font-size: 0.8em;

            > span {
              color: ${({ theme }) => theme.colors.text.secondary.lighter};
            }
          }
        }
      }
    }
  }
`;

export default {
  name: 'Coins',
  data() {
    return {
      monkey: require('@/assets/avatars/1.webp'),
    };
  },
  components: {
    Container,
    Card,
    Dash,
    Tether,
    Ethereum,
    Fiat,
    Bitcoin,
    Tron,
    Doge,
    Litecoin,
    Stellar,
    StyledButton,
    Spinner,
    Earn,
    Eye,
    EyeOff,
    FloatingButton,
  },
  async mounted() {
    feather.replace();

    await this.fetchWallets();
  },
  computed: {
    fiatCoins() {
      return this.wallets.results.filter(wallet => wallet.currency === 'NGN');
    },
    yourCoins() {
      return this.removeFiat(
        this.wallets.results.filter(wallet => !!wallet.available_balance),
      );
    },
    otherCoins() {
      return this.removeFiat(
        this.wallets.results.filter(wallet => !wallet.available_balance),
      );
    },
    ...mapGetters('wallets', ['wallets']),
    ...mapGetters('user', ['user', 'hideBalance', 'isDesktop', 'isMobile']),
  },
  methods: {
    openDepositModal() {
      this.$emit('openDepositModal');
    },
    openSendCoinModal() {
      this.$emit('openSendCoinModal');
    },
    openSwapModal(option = null) {
      this.setActiveSwapCoin(option);
      this.$emit('openSwapModal');
    },
    removeFiat(wallets) {
      if (this.user.country_code === 'NG') return wallets;
      return wallets.filter(wallet => wallet.currency !== 'NGN');
    },
    ...mapActions('wallets', ['fetchWallets']),
    ...mapMutations('user', ['setActiveSwapCoin', 'setHideBalance']),
  },
};
</script>
