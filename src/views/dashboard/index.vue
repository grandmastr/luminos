<template>
  <container>
    <div class="logo-container">
      <logo class="sm-logo" />
      <styled-button
        @click="becomeAProvider = true"
        v-if="
          isDesktop &&
          user.account_type !== 'POOL_PROVIDER' &&
          user.country_code === 'NG'
        "
      >
        <div>Be a pool provider</div>
        <div>
          <i data-feather="chevron-right" />
        </div>
      </styled-button>
    </div>
    <main>
      <template v-if="isDesktop">
        <swaps />
        <coins
          data-aos="zoom-out"
          data-aos-delay="50"
          @openSwapModal="swapCoinsModal = true"
          @openDepositModal="depositModal = true"
          @openSendCoinModal="sendCoinModal = true"
        />
        <keep-alive>
          <transition-group
            name="fade"
            data-aos="zoom-out"
            data-aos-delay="150"
            tag="div"
          >
            <settings
              :key="'settings'"
              v-if="settingsActive"
              @openMonkeyTag="monkeyTag = true"
              @openProfileSettings="openProfile"
              @openMonkeyBoard="monkeyBoard = true"
              @confirmLogout="confirmLogout = true"
            />
            <profile
              :key="'profile'"
              v-else-if="profileActive"
              @closeProfileSettings="openSettings"
              @showPhoneNumber="phoneNumber = true"
              @changePassword="changePassword = true"
            />
          </transition-group>
        </keep-alive>
      </template>
      <template v-else-if="isMobile">
        <swaps @openPoolDetails="openPoolDetails" v-if="mobile.transactions" />
        <coins
          v-else-if="mobile.coins"
          @openSwapModal="swapCoinsModal = true"
          @openDepositModal="depositModal = true"
          @openSendCoinModal="sendCoinModal = true"
          @becomeAProvider="becomeAProvider = true"
        />
        <template v-else-if="mobile.settings">
          <keep-alive>
            <transition-group name="fade" tag="div">
              <settings
                :key="'settings'"
                v-if="settingsActive"
                @openMonkeyTag="monkeyTag = true"
                @openProfileSettings="openProfile"
                @openMonkeyBoard="monkeyBoard = true"
                @confirmLogout="confirmLogout = true"
              />
              <profile
                :key="'profile'"
                v-else-if="profileActive"
                @closeProfileSettings="openSettings"
                @showPhoneNumber="phoneNumber = true"
                @changePassword="changePassword = true"
              />
            </transition-group>
          </keep-alive>
        </template>
      </template>
      <template>
        <modal
          :visible="!downTimeWarning"
          :dismiss="closeDownTimeWarning"
          width="540"
        >
          <down-time-warning @dismiss="closeDownTimeWarning" />
        </modal>
        <modal
          :visible="monkeyBoard"
          title="Monkeyboard"
          :dismiss="closeMonkeyBoard"
        >
          <monkey-board />
        </modal>
        <modal
          :visible="swapCoinsModal"
          title="Swap coins"
          :dismiss="closeSwapCoinsModal"
        >
          <swap-coins @dismiss="closeSwapCoinsModal" />
        </modal>
        <modal
          :visible="depositModal"
          title="Deposit"
          :dismiss="closeDepositModal"
        >
          <deposit />
        </modal>
        <modal
          :visible="sendCoinModal"
          title="Send coin"
          :dismiss="closeSendCoinModal"
        >
          <send-coin @dismiss="closeSendCoinModal" />
        </modal>
        <modal
          :back="verifyPhone ? goToPhoneUpdate : null"
          :visible="phoneNumber"
          :dismiss="closePhoneNumber"
          :title="verifyPhone ? 'Verify phone number' : 'Update phone number'"
        >
          <transition-group name="fade">
            <update-phone-number
              :key="'update-phone'"
              v-if="updatePhone"
              @openVerifyPhoneNumber="goToPhoneVerification"
            />
            <verify-phone-number
              :key="'verify-phone'"
              v-else-if="verifyPhone"
              @dismiss="closePhoneNumber"
            />
          </transition-group>
        </modal>
        <modal
          :visible="poolDetails"
          :dismiss="closePoolDetails"
          title="Pool Details"
          width="350"
        >
          <pool-details />
        </modal>
        <modal
          :visible="monkeyTag"
          :dismiss="closeMonkeyTag"
          title="Set monkeytag"
        >
          <monkey-tag @closeMonkeyTag="closeMonkeyTag" />
        </modal>
        <modal
          :visible="becomeAProvider"
          :dismiss="closeProvider"
          :title="poolBack.title"
          :title-size="poolState === 'swapCurrencies' ? 'sm' : 'lg'"
          :back="poolBack.action"
        >
          <transition-group name="fade" tag="div">
            <earn-money
              v-if="poolProvider.earnMoney"
              key="earn-money"
              @getPoolProvisionStarted="go('earnMoney', 'commit', null, 300)"
            />
            <commit
              v-else-if="poolProvider.commit"
              key="commit"
              @goToNext="goToDuration"
            />
            <lock-duration
              v-else-if="poolProvider.lockDuration"
              key="lock-duration"
              @goToNext="becomePoolProvider"
              :processing="becomingProvider"
            />
          </transition-group>
        </modal>
        <modal
          :visible="confirmLogout"
          :dismiss="closeConfirmLogout"
          :dismissible="false"
        >
          <logout @dismiss="closeConfirmLogout" />
        </modal>
        <modal
          :visible="changePassword"
          :dismiss="closeChangePassword"
          title="Change Password"
        >
          <change-password @dismiss="closeChangePassword" />
        </modal>
      </template>
    </main>
    <bottom-navigation v-if="isMobile" @goToTab="switchTabs" />
    <v-offline @detected-condition="checkForNetwork" />
  </container>
</template>

<script>
import VOffline from 'v-offline';
import feather from 'feather-icons';
import styled from 'vue-styled-components';
import { mapActions, mapGetters, mapMutations } from 'vuex';

import {
  BottomNavigation,
  Button,
  ChangePassword,
  Deposit,
  Logout,
  Modal,
  MonkeyBoard,
  MonkeyTag,
  PoolDetails,
  SendCoin,
  SwapCoins,
  UpdatePhoneNumber,
  VerifyPhoneNumber,
} from '@/components';
import { Logo } from '@/assets';
import { loadRoute, query, setMaxWidth, wait } from '@/helpers';
import { BREAKPOINTS } from '@/constants';
import {
  Coins,
  Commit,
  DownTimeWarning,
  EarnMoney,
  LockDuration,
  Profile,
  Settings,
  Swaps,
} from '@/fragments';
import { pool, user } from '@/api';

const StyledButton = styled(Button)`
  width: 180px;
  padding: 0 0 0 1.25em;
  height: 48px;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  font-size: 0.8em;
  position: relative;
  top: -30px;

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

const Container = styled('div')`
  background-color: ${({ theme }) => theme.colors.white};

  ${query.maxWidth('large1')`
    background-color: ${({ theme }) => theme.colors['ghost-white-background']};
    height: 100vh;
    padding-bottom: 12px;
  `};

  div.logo-container {
    display: grid;
    justify-items: end;
    padding: 4.4rem 1rem 0 1rem;
    position: relative;
    ${setMaxWidth()};

    .sm-logo {
      width: 212px;
      height: 38px;
      position: absolute;
      place-self: center;
    }
  }

  main {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 30px;
    ${setMaxWidth()};
    padding: 0.5rem 1rem 1.2rem 1rem;

    ${query.maxWidth('large1')`
      grid-template-columns: none;
      background: ${({ theme }) => theme.colors['ghost-white-background']};
    `};
  }
`;

export default {
  name: 'Dashboard',
  data() {
    return {
      monkeyBoard: false,
      swapCoinsModal: false,
      sendCoinModal: false,
      swapMethodModal: false,
      swapListingModal: true,
      changePassword: false,
      depositModal: false,
      confirmLogout: false,
      settingsActive: true,
      profileActive: false,
      phoneNumber: false,
      updatePhone: true,
      verifyPhone: false,
      poolDetails: false,
      becomeAProvider: false,
      testModal: false,
      poolState: 'earn-money',
      monkeyTag: false,
      poolProvider: {
        earnMoney: true,
        commit: false,
        lockDuration: false,
        swapCurrencies: false,
      },
      networkStatus: true,
      pool: {
        duration: '',
        amount: '',
      },
      becomingProvider: false,
      poolData: '',
      mobile: {
        transactions: false,
        coins: false,
        settings: false,
      },
    };
  },
  components: {
    Container,
    Logo,
    // eslint-disable-next-line vue/no-unused-components
    Coins,
    // eslint-disable-next-line vue/no-unused-components
    Settings,
    // eslint-disable-next-line vue/no-unused-components
    Swaps,
    // eslint-disable-next-line vue/no-unused-components
    Profile,
    Modal,
    MonkeyBoard,
    SwapCoins,
    SendCoin,
    Deposit,
    StyledButton,
    UpdatePhoneNumber,
    VerifyPhoneNumber,
    PoolDetails,
    EarnMoney,
    Commit,
    LockDuration,
    MonkeyTag,
    VOffline,
    Logout,
    ChangePassword,
    BottomNavigation,
    DownTimeWarning,
  },
  mounted() {
    feather.replace();
    this.mobile.coins = true;

    window.addEventListener('resize', this.listenForWindowResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.listenForWindowResize);
  },
  computed: {
    poolBack() {
      switch (this.poolState) {
        case 'earnMoney':
          return {
            title: 'Become a pool provider',
            action: null,
          };
        case 'commit':
          return {
            title: '',
            action: () => {
              this.go('commit', 'earnMoney', null, 310);
            },
          };
        case 'lockDuration':
          return {
            title: '',
            action: () => {
              this.go('lockDuration', 'commit', null, 320);
            },
          };
        default:
          return {
            title: 'Become a pool provider',
            action: null,
          };
      }
    },
    ...mapGetters('user', [
      'token',
      'user',
      'isMobile',
      'isDesktop',
      'activeTransaction',
    ]),
    ...mapGetters('wallets', ['downTimeWarning']),
  },
  methods: {
    listenForWindowResize() {
      this.setResponsiveness({
        mobile: window.screen.width <= BREAKPOINTS.large1,
        desktop: window.screen.width > BREAKPOINTS.large1,
      });
    },
    closeDownTimeWarning() {
      this.setDownTimeWarning(true);
    },
    closeMonkeyBoard() {
      this.monkeyBoard = false;
    },
    closeSwapCoinsModal() {
      this.setActiveSwapCoin(null);

      this.swapCoinsModal = false;
    },
    closeDepositModal() {
      this.depositModal = false;
    },
    closeSendCoinModal() {
      this.sendCoinModal = false;
    },
    switchViews(prev, next, time = 300) {
      this[prev] = false;

      wait(() => (this[next] = true), time);
    },
    openProfile() {
      this.switchViews('settingsActive', 'profileActive');
    },
    openSettings() {
      this.switchViews('profileActive', 'settingsActive');
    },
    openSwapDetails() {
      this.switchViews('swapsActive', 'swapDetailsActive', 300);
    },
    openSwaps() {
      this.switchViews('swapDetailsActive', 'swapsActive');
    },
    closePhoneNumber() {
      this.goToPhoneUpdate();

      this.phoneNumber = false;
    },
    closePoolDetails() {
      this.poolDetails = false;
    },
    closeConfirmLogout() {
      this.confirmLogout = false;
    },
    closeChangePassword() {
      this.changePassword = false;
    },
    closeMonkeyTag() {
      this.monkeyTag = false;
    },
    goToPhoneVerification() {
      this.updatePhone = false;

      wait(() => (this.verifyPhone = true), 300);
    },
    goToPhoneUpdate() {
      this.verifyPhone = false;

      wait(() => (this.updatePhone = true), 300);
    },
    go(prev, next, action = null, delay = 50) {
      this.poolProvider[prev] = false;

      wait(() => {
        this.poolState = next;
        this.poolProvider[next] = true;

        if (action) {
          action();
        }
      }, delay);
    },
    goToMobileTab(current, next, action = null, delay = 100) {
      this.mobile[current] = false;

      wait(() => {
        this.mobile[next] = true;
      }, delay);
    },
    closeProvider() {
      sessionStorage.clear();
      this.go(this.poolState, 'earnMoney');

      this.becomeAProvider = false;
    },
    checkForNetwork(online) {
      this.networkStatus = online;
    },
    goToDuration(option) {
      this.pool.amount = option;
      this.go('commit', 'lockDuration', null, 315);
    },
    openPoolDetails(data) {
      this.poolData = data;
      this.poolDetails = true;
    },
    switchTabs({ current, next }) {
      this.goToMobileTab(current, next);
    },
    async becomePoolProvider(duration) {
      this.pool.duration = duration;

      this.becomingProvider = true;
      try {
        const data = await pool.become({ amount: this.pool.amount });

        if (data?.success) {
          this.closeProvider();

          const data = await user.get();

          if (data?.success) {
            await this.syncUserData({
              user: data.response,
            });

            loadRoute(this.$route.path || '/');
          }
        }
      } finally {
        this.becomingProvider = false;
      }
    },
    ...mapActions('user', ['syncUserData']),
    ...mapMutations('user', [
      'setActiveSwapCoin',
      'setResponsiveness',
      'setActiveTransaction',
    ]),
    ...mapMutations('wallets', ['setDownTimeWarning']),
  },
  watch: {
    networkStatus(value) {
      if (value) {
        this.$toast.success('You are online');
      } else {
        this.$toast.error('You are offline');
      }
    },
    activeTransaction(value) {
      if (value) {
        this.openSwapDetails();
      } else {
        this.setActiveTransaction(null);
        this.openSwaps();
      }
    },
  },
};
</script>
