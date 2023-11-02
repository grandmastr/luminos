<template>
  <settings-card>
    <profile>
      <div class="header-container">
        <back role="button" @click="closeProfileSettings" class="back-button" />
        <h3>Profile settings</h3>
      </div>
      <div class="profile-dets__board">
        <div class="row">
          <span id="nameLabel" class="title"> name </span>
          <span aria-labelledby="nameLabel" class="value">
            {{ user.name }}
          </span>
        </div>
        <hr />
        <div class="row email">
          <span id="nameLabel" class="title"> email address </span>
          <span aria-labelledby="nameLabel" class="value">
            {{ user.email }}
          </span>
        </div>
        <div class="clear" />
        <div class="row">
          <span id="nameLabel" class="title"> phone number </span>
          <div class="merged-row">
            <span aria-labelledby="nameLabel" class="value phone">
              {{ user.phone || 'N/A' }}
            </span>
            <edit class="edit" role="button" @click="showPhoneNumber" />
          </div>
        </div>
      </div>
      <div class="profile-dets__board second">
        <div class="row">
          <span id="nameLabel" class="title"> password </span>
          <div class="merged-row">
            <span aria-labelledby="nameLabel" class="value"> ********* </span>
            <edit class="edit" role="button" @click="$emit('changePassword')" />
          </div>
        </div>
      </div>
    </profile>
  </settings-card>
</template>

<script>
import AOS from 'aos';
import styled from 'vue-styled-components';

import { Card } from '@/components';
import { Back, Edit } from '@/assets';
import { mapGetters } from 'vuex';

const Profile = styled('div')`
  height: 100%;

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

  div.profile-dets__board {
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 8px;
    padding: 1em 0 0.1em 0;

    &.second {
      margin-top: 1.5em;
    }

    hr {
      border: 1px solid rgba(12, 16, 58, 0.1);
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
        font-size: 0.875em;
        color: ${({ theme }) => theme.colors['dark-blue']};
        font-feature-settings: 'tnum' on, 'lnum' on;

        &.phone {
          margin-top: -0.75em;
        }
      }
    }
  }
`;

const SettingsCard = styled(Card)`
  padding: 2.3rem 1.5rem;
  height: 100%;
  position: relative;

  div.title {
    display: grid;
    align-items: center;
    grid-gap: 20px;
    grid-template-columns: 32px 1fr;

    h2 {
      font-family: ${({ theme }) => theme.fontFamily('Fraunces')};
      color: ${({ theme }) => theme.colors.purple};
      margin: 0;
    }
  }

  div.board-card {
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 0.5em;
    margin-top: 24px;
    overflow: hidden;

    hr {
      border: 1px solid rgba(12, 16, 58, 0.1);
    }

    div.row {
      padding: 12px 20px 5px 20px;

      span.row-title {
        font-weight: bold;
        font-size: 0.9em;
        font-variant: small-caps;
        text-transform: lowercase;
        font-feature-settings: 'tnum' on, 'lnum' on;
        color: ${({ theme }) => theme.colors.text.secondary.lighter};
        line-height: 140%;
        letter-spacing: 0.1em;
      }

      div.merged-row {
        display: flex;
        justify-content: space-between;
        margin-top: 12px;
        margin-bottom: 20px;
        align-items: center;

        p {
          margin: 0;
          font-weight: 500;
        }

        .exit,
        .cog {
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

      &.PhoneNumber {
        display: grid;
        place-items: center;
        color: ${({ theme }) => theme.colors.purple};
        padding-bottom: 1.2em;
        font-size: 0.8em;
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
      ShowVerifyNumber: false,
    };
  },
  components: {
    SettingsCard,
    Back,
    Edit,
    Profile,
  },
  mounted() {
    // eslint-disable-next-line no-unused-expressions
    AOS?.init();
  },
  methods: {
    closeProfileSettings() {
      this.$emit('closeProfileSettings');
    },
    showPhoneNumber() {
      this.$emit('showPhoneNumber');
    },
  },
  computed: mapGetters('user', ['user']),
};
</script>

<style scoped></style>
