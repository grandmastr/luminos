<template>
  <main>
    <SignUpHead text="Select country">
      <template #head> Select Country</template>
    </SignUpHead>
    <CountryCodeDropdown
      label="Country"
      v-model="selectedCountry"
      :disabled="true"
      :showImage="true"
      instruction="SELECT country"
      @change="chooseCountry"
    >
    </CountryCodeDropdown>
    <Button
      text="Next"
      :disabled="!selectedCountry"
      styles="margin-top: 50px"
      @click="$router.push('./step-4')"
    />
  </main>
</template>

<script>
import { Button, CountryCodeDropdown } from '@/components';

import signUpMixin from '@/views/auth/SignUp/signUpMixin';

export default {
  name: 'Country',
  mixins: [signUpMixin],
  data() {
    return {
      selectedCountry: '',
    };
  },
  components: {
    CountryCodeDropdown,
    Button,
  },
  methods: {
    chooseCountry(country) {
      this.selectedCountry = country.name;
      this.setSignUpDetails({
        countryCode: country.code,
      });
    },
  },
};
</script>
