<template>
  <PhoneNumber>
    <CountryCodeDropdown
      label="Phone number"
      type="tel"
      placeholder=" "
      @change="setCountryCode"
      v-model="phone"
      class="dropdown"
    />
    <Button @click="updatePhone" :disabled="disabled">
      <template v-if="verified">
        <Check />
      </template>
      {{ verified ? 'Verified' : 'Verify Number' }}
    </Button>
  </PhoneNumber>
</template>

<script>
import styled from 'vue-styled-components';

import { user } from '@/api';
import { Check } from '@/assets';
import { Button, CountryCodeDropdown } from '@/components';
import { mapActions, mapGetters } from 'vuex';
import { stripPhone } from '@/helpers';

const PhoneNumber = styled('form')`
   {
    padding: 22px 0;

    .dropdown {
      margin-bottom: 100px;
    }
  }
`;

export default {
  components: {
    CountryCodeDropdown,
    PhoneNumber,
    Button,
    Check,
  },
  data() {
    return {
      phone: ' ',
      countryCode: null,
      verified: false,
      processing: false,
    };
  },
  computed: {
    disabled() {
      return this.processing || !this.phone || this.verified;
    },
    ...mapGetters('user', ['user']),
  },
  methods: {
    setCountryCode(country) {
      this.countryCode = country.dial_code;
    },
    openVerifyPhoneNumber() {
      this.$emit('openVerifyPhoneNumber', this.phone);
    },
    async updatePhone() {
      this.processing = true;
      try {
        const data = await user.update(
          {
            phone: `${this.countryCode || '+234'}${this.phone
              .trim()
              .substr(1)}`,
          },
          `An OTP has been sent to ${this.phone}`,
        );

        if (data?.success) {
          await this.syncUserData({ user: data.response });

          this.openVerifyPhoneNumber();
        }
      } finally {
        this.processing = false;
      }
    },
    ...mapActions('user', ['syncUserData']),
  },
  mounted() {
    this.phone = stripPhone(this.user?.phone) || this.phone;
    this.verified = this.user?.phone_verified;
  },
  watch: {
    phone() {
      this.verified = false;
    },
  },
};
</script>
