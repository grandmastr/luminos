<template>
  <main>
    <SignUpHead text="Create your password" />
    <Input
      type="password"
      label="password"
      placeholder=" "
      v-model="password"
      autocomplete="new-password"
      class="mb-5"
    ></Input>
    <Button
      text="Next"
      :disabled="!password"
      @click="clickEvent"
      styles="margin-top: auto"
    ></Button>
  </main>
</template>

<script>
import signUpMixin from '@/views/auth/SignUp/signUpMixin';
import { auth } from '@/api';
import { loadRoute } from '@/helpers';

export default {
  name: 'Password',
  mixins: [signUpMixin],
  data() {
    return {
      password: null,
      processing: false,
    };
  },
  methods: {
    clickEvent() {
      this.setSignUpDetails({ password: this.password });

      this.signUp();
    },
    async signUp() {
      this.processing = true;
      try {
        const { success, response } = await auth.signUp(this.signUpDetails);

        if (success) {
          await this.syncToken(response.access);
          await this.syncUserData({ user: response.user });

          loadRoute();
        }
      } finally {
        this.processing = false;
      }
    },
  },
  mounted() {
    this.password = this.signUpDetails?.password || '';
  },
};
</script>

<style scoped>
.mb-5 {
  margin-bottom: 44px;
}
</style>
