<template>
  <settings-card overflow="none">
    <div :key="'profile'" v-if="profileActive">
      <div style="position: relative">
        <div class="avatar-container">
          <div class="avatar-circle" role="img">
            <template v-if="updating">
              <spinner />
            </template>
            <template v-else>
              <img
                :src="require(`@/assets/avatars/${user.avatar || 1}.webp`)"
                alt="user avatar"
              />
              <div class="edit-pill">
                <edit
                  class="edit"
                  role="button"
                  @click="monkeysShow = !monkeysShow"
                  aria-controls="profileMonkeys"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="board-card leaderboard">
        <template v-if="monkeyboard.fetching">
          <div class="spinner-container">
            <spinner />
          </div>
        </template>
        <template v-else>
          <div class="row">
            <span class="row-title" id="swapRank"> swap rank </span>
            <div class="merged-row">
              <span class="rank-badge" aria-label="position on table">
                {{ positionOnBoard | positions }}
              </span>
              <span class="rank-points" aria-labelledby="swapRank">
                <template v-if="numberOfSwaps">
                  {{ numberOfSwaps * 10 }}pts
                </template>
                <template v-else> N/A </template>
              </span>
            </div>
          </div>
          <hr />
          <div class="row monkeyboard" role="button" @click="openBoard">
            View Monkeyboard
          </div>
        </template>
      </div>
      <div class="board-card">
        <div class="row">
          <span class="row-title" id="moneyTag"> monkey tag </span>
          <div class="merged-row" aria-labelledby="moneyTag">
            <div class="merged-row user">
              <span v-if="user.swap_tag"> {{ user.swap_tag }} </span>
              <span v-else> N/A </span>
              <edit class="edit" role="button" @click="openMonkeyTag" />
            </div>
          </div>
        </div>
        <hr />
        <div class="row">
          <span class="row-title" id="successfulSwaps"> successful swaps </span>
          <div class="merged-row" aria-labelledby="successfulSwaps">
            <span> {{ numberOfSwaps || 0 }} </span>
          </div>
          <div class="merged-row-container">
            <span class="row-title" id="mostSwappedCoins">
              most swapped coins
            </span>
            <div class="merged-row" aria-labelledby="mostSwappedCoins">
              <span> N/A </span>
            </div>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="merged-row" role="button" @click="openProfileSettings">
            <span class="profile"> Profile Settings </span>
            <cog class="cog" />
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="merged-row" role="button" @click="$emit('confirmLogout')">
            <span class="logout"> Logout </span>
            <exit class="exit" />
          </div>
        </div>
      </div>
    </div>
    <template>
      <transition name="fade">
        <article v-if="monkeysShow" id="profileMonkeys" ref="monkeyToolTip">
          <h3>choose your monkey</h3>
          <div class="monkeys-container">
            <div
              v-for="n in 20"
              :key="n"
              :class="['monkey', n === (user.avatar || 1) ? 'active' : '']"
              role="button"
              @click="updateMonkey(n)"
              :title="n | monkey"
              :aria-label="n | monkey"
            >
              <img
                :src="require(`@/assets/avatars/${n}.webp`)"
                :alt="`Monkey number ${n}}`"
              />
            </div>
          </div>
        </article>
      </transition>
    </template>
  </settings-card>
</template>

<script>
import styled from 'vue-styled-components';
import { mapActions, mapGetters } from 'vuex';

import { Card, Spinner } from '@/components';
import { Cog, Edit, Exit } from '@/assets';
import { wait } from '@/helpers';
import { monkey } from '@/lib';

const SettingsCard = styled(Card)`
  padding: 2.3rem 1.5rem;
  position: relative;
  height: 680px;

  article {
    background-color: ${({ theme }) => theme.colors.white};
    position: absolute;
    top: 160px;
    width: 413px;
    border-radius: 8px;
    padding: 1.5em 1em;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
    z-index: 2;
    align-self: center;
    display: flex;
    flex-direction: column;
    align-items: center;

    &:before {
      content: '';
      display: block;
      height: 20px;
      width: 20px;
      background-color: ${({ theme }) => theme.colors.white};
      position: absolute;
      top: -10px;
      left: calc(50% - 10px);
      transform: rotate(45deg);
      border-top-left-radius: 4px;
      margin: auto;
      z-index: 0;
    }

    h3 {
      color: ${({ theme }) => theme.colors.text.secondary.lighter};
      font-weight: 500;
      font-size: 0.8em;
      margin: 0;
      text-align: center;
      letter-spacing: 0.1em;
      font-variant: small-caps;
      font-feature-settings: 'tnum' on, 'lnum' on;
    }

    div.monkeys-container {
      padding: 20px 20px 4px 20px;
      display: grid;
      gap: 20px 24px;
      grid-template-columns: repeat(4, 1fr);
      grid-auto-flow: row;

      div.monkey {
        height: 70px;
        width: 70px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        cursor: pointer;
        transition: background-color 100ms ease-in-out;

        img {
          width: 46.5px;
          height: 40.79px;
        }

        &:hover,
        &.active {
          background-color: ${({ theme }) =>
            theme.colors['ghost-white-background']};
        }
      }
    }
  }

  div.avatar-container {
    display: grid;
    place-items: center;
    position: relative;
    z-index: 0;

    div.avatar-circle {
      padding: 1em;
      height: 100px;
      width: 100px;
      background-color: ${({ theme }) => theme.colors.white};
      border-radius: 50%;
      display: grid;
      place-items: center;
      place-content: center;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
      position: relative;

      div.edit-pill {
        position: absolute;
        background-color: ${({ theme }) => theme.colors.white};
        width: 120px;
        display: flex;
        justify-content: flex-end;
        z-index: -1;
        right: -42px;
        padding: 7px 10px;
        border-radius: 0 40px 40px 0;
      }
    }
  }

  div.board-card {
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 0.5em;
    margin-top: 24px;
    overflow: hidden;

    &.leaderboard {
      height: 130.41px;

      div.spinner-container {
        height: 100%;
        display: grid;
        place-content: center;

        div.spinner {
          place-self: center;
        }
      }
    }

    hr {
      border: 1px solid rgba(12, 16, 58, 0.1);
    }

    div.row {
      padding: 12px 20px 5px 20px;

      span.row-title {
        font-weight: 500;
        font-size: 0.9em;
        font-variant: small-caps;
        font-feature-settings: 'tnum' on, 'lnum' on;
        color: ${({ theme }) => theme.colors.text.secondary.lighter};
      }

      div.merged-row {
        display: flex;
        justify-content: space-between;
        margin-top: 6px;

        &.user {
          width: 100%;
        }

        .exit,
        .cog,
        .edit {
          position: relative;
          top: -6px;
        }

        span {
          color: ${({ theme }) => theme.colors['dark-blue']};
          font-weight: 500;
          font-size: 0.9em;
        }

        span.rank-points,
        span.rank-badge {
          border-radius: 8px;
          display: grid;
          place-items: center;
          place-content: center;
          font-weight: 500;
          padding: 0.3em 1em;
        }

        span.rank-badge {
          background-color: rgba(251, 176, 59, 0.4);
        }

        span.rank-points {
          background-color: rgba(37, 204, 104, 0.1);
          color: ${({ theme }) => theme.colors['good-green']};
        }

        &[role='button'] {
          margin: 2px 0;

          span {
            font-weight: 500;
            font-size: 0.9em;

            &.profile {
              color: ${({ theme }) => theme.colors.purple};
            }

            &.logout {
              color: ${({ theme }) => theme.colors['bad-red']};
              position: relative;
              top: -3px;
            }
          }
        }
      }

      &.monkeyboard {
        display: grid;
        place-items: center;
        color: ${({ theme }) => theme.colors.purple};
        padding: 0.8em 0 1.4em 0;
        font-size: 0.875em;
        font-weight: 500;
      }
    }

    div.merged-row-container {
      margin-top: 16px;
    }
  }
`;

SettingsCard.name = 'SettingsCard';

export default {
  name: 'Settings',
  data() {
    return {
      monkeyBoard: false,
      activeScreen: 'profile',
      profileActive: true,
      settingsActive: false,
      monkeysShow: false,
      updating: false,
    };
  },
  components: {
    Cog,
    Exit,
    Edit,
    SettingsCard,
    Spinner,
  },
  computed: {
    numberOfSwaps() {
      return this.monkeyboard.results.find(
        n => n.swap_tag === this.user.swap_tag,
      )?.completed_swaps;
    },
    positionOnBoard() {
      return this.monkeyboard.results.find(
        n => n.swap_tag === this.user.swap_tag,
      )?.position;
    },
    ...mapGetters('user', ['user']),
    ...mapGetters('monkeyboard', ['monkeyboard']),
  },
  methods: {
    openBoard() {
      this.$emit('openMonkeyBoard', true);
    },
    openProfileSettings() {
      this.$emit('openProfileSettings');
    },
    openSettings() {
      this.settingsActive = false;

      wait(() => (this.profileActive = true), 300);
    },
    openMonkeyTag() {
      this.$emit('openMonkeyTag');
    },
    async updateMonkey(key) {
      this.updating = true;
      try {
        const data = await this.updateUser({ avatar: key });

        if (data?.success) {
          this.$toast.success(`Hey ${monkey(key)}`);
          this.monkeysShow = false;
        }
      } finally {
        this.updating = false;
      }
    },
    listenForEscape(event) {
      const ESC_CODE = 27;

      if (event.keyCode === ESC_CODE && this.monkeysShow) {
        this.monkeysShow = false;
      }
    },
    listenForOutsideClick(event) {
      if (!this.$refs.monkeyToolTip?.contains(event.target)) {
        this.monkeysShow = false;
      }
    },
    ...mapActions('user', ['updateUser']),
    ...mapActions('monkeyboard', ['getMonkeyboard']),
  },
  watch: {
    monkeysShow(value) {
      if (value) {
        document.addEventListener('keydown', this.listenForEscape);
        document.addEventListener('mousedown', this.listenForOutsideClick);
      }
    },
  },
  async mounted() {
    await this.getMonkeyboard();
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.listenForEscape);
    document.removeEventListener('mousedown', this.listenForOutsideClick);
  },
};
</script>
