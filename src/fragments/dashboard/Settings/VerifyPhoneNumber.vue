<template>
  <VerifyNumber>
    <form class="otp-form" autocomplete="off">
      <p v-if="userPhoneNumber" class="form__descrption">
        Enter OTP sent to your registered phone number ending with ({{
          userPhoneNumber
        }}).
      </p>
      <fieldset
        id="otp"
        class="input"
        :class="{ valid: otp.length === otpMaxLength, error }"
      >
        <input
          v-for="n in otpMaxLength"
          :key="n"
          :id="'digit-' + n"
          :name="'digit-' + n"
          pattern="\d*"
          maxlength="1"
          :disabled="processing"
        />
      </fieldset>
    </form>
    <hr />
    <div class="timer">
      <Button
        text="Resend OTP"
        type="link"
        state="primary"
        :disabled="timer !== 0"
        @click="resendOTP"
      />
      <span>{{ timer }}s</span>
    </div>
  </VerifyNumber>
</template>

<script>
import styled from 'vue-styled-components';
import { Button } from '@/components';
import { mapGetters } from 'vuex';
import { user } from '@/api';

const otpMaxLength = 5;
const VerifyNumber = styled('article')`
{
  .otp-form {
    padding: 62px 0;
    font-weight: 500;
    text-align: center;
    max-width: 284px;
    margin-left: auto;
    margin-right: auto;

    p {
      font-size: 14px;
    }

    fieldset {
      all: unset;
    }

    .form__descrption {
      color: ${({ theme }) => theme.colors['dark-blue']};
      margin-bottom: 16px;
    }

    .input {
      display: grid;
      grid-gap: 15px;
      grid-template-columns: repeat(${otpMaxLength}, 59px);
      justify-content: center;
      margin-bottom: 23px;

      input {
        height: 59px;
        line-height: 59px;
        text-align: center;
        font-weight: 200;
        color: ${({ theme }) => theme.colors['dark-blue']};
        border: 1.5px solid ${({ theme }) => theme.colors.purple};
        border-radius: 8px;
        appearance: none;
      }

      &.valid {
        input {
          border-color: ${({ theme }) => theme.colors['good-green']};
        }
      }

      &.error {
        input {
          border-color: ${({ theme }) => theme.colors['bad-red']};
        }
      }
    }
  }

  .timer {
    padding: 25px 0;
    color: ${({ theme }) => theme.colors.text.secondary.lighter};
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
}
`;

export default {
  components: {
    VerifyNumber,
    Button,
  },
  watch: {
    otp(value) {
      if (value.length === this.otpMaxLength) {
        this.verify();
      }
    },
  },
  data() {
    return {
      timer: null,
      inputs: [],
      otpMaxLength,
      timerObj: null,
      error: null,
      processing: false,
    };
  },
  computed: {
    otp() {
      const inputs = this.inputs;
      let compiledOtp = '';
      for (let i = 0; i < inputs.length; i++) {
        compiledOtp += inputs?.[i];
      }
      return compiledOtp;
    },
    userPhoneNumber() {
      const number = this.user.phone.toString();
      if (!number) return;
      return number?.substr?.(number.length - 4, number.length);
    },
    ...mapGetters('user', ['user']),
  },
  methods: {
    async verify() {
      this.processing = true;
      try {
        const data = await user.verify({ code: this.otp });

        if (data?.success) {
          this.$emit('dismiss');
        }
      } catch {
        this.inputs = [];
      } finally {
        this.inputs = [];
        this.processing = false;
      }
    },
    setCountryCode(countryCode) {
      this.countryCode = countryCode;
    },
    openVerifyPhoneNumber() {
      this.$emit('openVerifyPhoneNumber');
    },
    makeTimer() {
      this.allowResend = false;
      this.timer = 30;
      this.timerObj = setInterval(() => {
        this.timer > 0 ? this.timer-- : clearInterval(this.timerObj);
      }, 1000);
    },
    makeOTP() {
      const inputs = document.querySelectorAll('#otp > *[id]');
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('keydown', event => {
          if (event.key === 'Backspace') {
            const initialState = inputs[i].value;
            inputs[i].value = '';
            this.$set(this.inputs, i, inputs[i].value);
            if (i !== 0 && !initialState) {
              inputs[i - 1].focus();
            }
          } else if (event.key === 'ArrowLeft' && i !== 0) {
            inputs[i - 1].focus();
          } else if (event.key === 'ArrowRight' && i !== inputs.length - 1) {
            inputs[i + 1].focus();
          }
        });
        inputs[i].addEventListener('input', () => {
          inputs[i].value = parseInt(inputs[i].value) || '';
          this.$set(this.inputs, i, inputs[i].value);
          if (i === inputs.length - 1 && inputs[i].value !== '') {
            return true;
          } else if (inputs[i].value !== '') {
            inputs[i + 1].focus();
          }
        });
      }
    },
    resendOTP() {
      this.makeTimer();
    },
  },
  mounted() {
    this.makeTimer();
    this.makeOTP();
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer);
    next();
  },
};
</script>
