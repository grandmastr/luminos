<template>
  <div>
    <container>
      <styled-card color="#FFFFFF">
        <div class="header">
          <logo />
        </div>
        <div class="body">
          <div>
            <h1>Welcome!</h1>
            <span> Please log into your account and lets jump right in </span>
            <router-link to="/sign-in">
              <styled-button> Login</styled-button>
            </router-link>
            <router-link to="/sign-up">
              <styled-button> Create an account</styled-button>
            </router-link>
          </div>
        </div>
        <div class="footer">
          <span>powered by flux</span>
        </div>
      </styled-card>
    </container>
    <wait-overlay
      role="alert"
      aria-busy="true"
      v-if="waiting.status"
      @click="openFluxAccounts"
    >
      <div class="spinner" />
      <p>
        <b> {{ waiting.message }} </b>, can't see tab? click to open <br />
        <span role="button" @click.stop="waiting.status = false"
          >Click to Close</span
        >
      </p>
    </wait-overlay>
  </div>
</template>

<script>
import styled, { keyframes } from 'vue-styled-components';
import { mapActions } from 'vuex';

import { Button, Card } from '@/components';
import { loadRoute, setMaxWidth } from '@/helpers';
import { Logo } from '@/assets';

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const WaitOverlay = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  display: grid;
  place-items: center;
  place-content: center;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.9);
  cursor: pointer;

  div.spinner {
    height: 4em;
    width: 4em;
    border-top: 2px solid ${({ theme }) => theme.colors.orange};
    border-left: 2px solid ${({ theme }) => theme.colors.orange};
    border-bottom: 2px solid ${({ theme }) => theme.colors.orange};
    border-radius: 50%;
    animation: ${rotate} 500ms infinite;
    margin-bottom: 18px;
  }

  p {
    color: ${({ theme }) => theme.colors.white};
    display: inline-block;
    margin-top: 48px;
    text-align: center;

    ${setMaxWidth(400)}
    span {
      text-decoration: underline;
      font-weight: bold;
      position: relative;
      top: 12px;
    }
  }
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 17px 24px;
  font-weight: 500;
  font-size: 1em;
`;

const FluxButton = StyledButton.extend`
  background-color: #855aaf;
  border-color: #855aaf;
  color: ${({ theme }) => theme.colors.white};
  padding: 12px 24px;
  position: relative;

  > div {
    display: flex;
    align-items: center;

    .logo {
      height: 28px;
      width: 28px;
      margin-right: 16px;
    }

    .info-icon {
      position: absolute;
      right: 0.5em;
    }
  }
`;

const StyledCard = styled(Card)`
  ${setMaxWidth(480)};
  padding: 0;

  div.header {
    display: grid;
    place-content: center;
    place-items: center;
    height: 90px;
    border-bottom: 1px solid rgba(12, 16, 58, 0.1);
  }

  div.body {
    padding: 1.2em 2em 3em 2em;

    > div {
      ${setMaxWidth(340)};

      h1,
      span {
        text-align: center;
      }

      h1 {
        color: ${({ theme }) => theme.colors.purple};
        font-family: ${({ theme }) => theme.fontFamily('Fraunces')};
        font-size: 1.8em;
        font-weight: 600;
      }

      span {
        ${setMaxWidth(300)};
        display: grid;
        place-items: center;
        color: ${({ theme }) => theme.colors.text.secondary.lighter};
        font-size: 0.9em;
        line-height: 20px;
      }
    }
  }

  div.footer {
    height: 60px;
    border-top: 1px solid rgba(12, 16, 58, 0.1);
    display: grid;
    place-items: center;
    place-content: center;

    span {
      color: ${({ theme }) => theme.colors.text.secondary.light};
      font-variant: small-caps;
      font-feature-settings: 'tnum' on, 'lnum' on;
      letter-spacing: 0.1em;
      font-weight: 500;
      font-size: 0.78em;
    }
  }
`;

const Container = styled.div`
  min-height: 100vh;
  padding: 1em;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
`;

StyledButton.name = 'CreateAccount';
FluxButton.name = 'SignInWithFlux';

export default {
  name: 'Welcome',
  data() {
    return {
      waiting: {
        status: false,
        message: 'establishing connection',
      },
      connectionInterval: Object.create({}),
      windowReference: Object.create({}),
    };
  },
  components: {
    Container,
    StyledCard,
    Logo,
    StyledButton,
    WaitOverlay,
  },
  methods: {
    async preventClose(event) {
      event.preventDefault();

      this.windowReference.close();
    },
    async listenForConnection() {
      const listen = event => {
        if (event.origin === process.env.VUE_APP_AUTH_ACCOUNTS_URL) {
          const { message, status, success, data } = event.data;

          if (success) {
            this.waiting.message = message;
          }

          if (status === 202) {
            clearInterval(this.connectionInterval);
          }

          if (status === 200) {
            this.waiting.status = false;
            this.syncUserData({ user: data.user });
            this.syncToken(data.token);

            loadRoute();
          }
        }
      };

      window.addEventListener('message', listen);
    },
    async openFluxAccounts() {
      this.waiting.status = true;
      try {
        const authWindow = window.open(
          process.env.VUE_APP_AUTH_ACCOUNTS_URL,
          'flux-auth-v1',
        );

        this.windowReference = authWindow;

        this.connectionInterval = setInterval(async () => {
          await authWindow.postMessage(
            'establish connection',
            process.env.VUE_APP_AUTH_ACCOUNTS_URL,
          );
        }, 500);

        await this.listenForConnection();
      } catch {
        //
      } finally {
        //
      }
    },
    ...mapActions('user', ['syncUserData', 'syncToken']),
  },
  async beforeMount() {
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('beforeunload', this.preventClose);
    });
  },
  watch: {
    'waiting.status'(status) {
      if (status) {
        window.addEventListener('beforeunload', this.preventClose);
      } else {
        this.windowReference.close();
      }

      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('beforeunload', this.preventClose);
      });
    },
    windowReference(windowRef) {
      const interval = setInterval(() => {
        if (windowRef.closed) {
          this.waiting.status = false;

          clearInterval(interval);
        }
      }, 500);
    },
  },
};
</script>
