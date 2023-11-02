<template>
  <main>
    <SignUpHead text="Choose a monkeytag" />
    <Input
      type="text"
      label="Your unique monkeytag"
      placeholder=" "
      v-model="swap_tag"
      autocomplete="monkeytag"
      class="mb-5"
    />
    <ErrorMessage v-if="error">
      <li v-for="(err, index) in error" :key="index">
        {{ err }}
      </li>
    </ErrorMessage>
    <Button
      text="Sign Up"
      :disabled="!swap_tag || processing"
      :loading="processing"
      @click="clickEvent"
      styles="margin-top: auto; margin-left: auto; margin-right: auto;"
    ></Button>
  </main>
</template>

<script>
import styled from 'vue-styled-components';
import { mapActions } from 'vuex';

import signUpMixin from '@/views/auth/SignUp/signUpMixin';
import { auth } from '@/api';
import { loadRoute } from '@/helpers';

const ErrorMessage = styled('ul')`
  li {
    font-size: 12px;
    color: ${({ theme }) => theme.colors['bad-red']};

    &:first-of-type {
      margin-top: -22px;
    }

    &:last-of-type {
      margin-bottom: 22px;
    }
  }
`;

export default {
  name: 'SwapTag',
  mixins: [signUpMixin],
  components: {
    ErrorMessage,
  },
  data() {
    return {
      swap_tag: null,
      processing: false,
      error: null,
    };
  },
  methods: {
    clickEvent() {
      this.setSignUpDetails({
        swapTag: this.swap_tag,
      });

      this.signUp();
    },
    async signUp() {
      this.processing = true;
      try {
        const data = await auth.signUp(this.signUpDetails);

        if (data?.success) {
          await this.syncToken(data.response.token);
          await this.syncUserData({ user: data.response.user });

          loadRoute();
        }
      } finally {
        this.processing = false;
      }
    },
    ...mapActions('user', ['syncUserData', 'syncToken']),
  },
  mounted() {
    this.swap_tag = this.signUpDetails?.swap_tag || '';
  },
};
</script>

<style scoped>
.mb-5 {
  margin-bottom: 44px;
}
</style>
