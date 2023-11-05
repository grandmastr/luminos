<template>
  <main>
    <!--    <SignUpHead text="Enter your email" />-->
    <Input
      type="email"
      label="email"
      placeholder=" "
      v-model="email"
      autocomplete="email"
      autofocus
      class="mb-2"
    ></Input>
    <Input
      type="password"
      label="Password"
      placeholder=" "
      v-model="password"
      autocomplete="email"
      class="mb-5"
    ></Input>
    <Button
      text="Next"
      @click="clickEvent"
      :disabled="!((email && email.includes('@')) || password)"
      styles="margin-top: auto"
    />
  </main>
</template>

<script>
import signUpMixin from '@/views/auth/SignUp/signUpMixin';
import { auth } from '@/api';
import { loadRoute } from '@/helpers';

export default {
  name: 'SignIn',
  mixins: [signUpMixin],
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    clickEvent() {
      this.setSignUpDetails({ email: this.email });

      this.signIn();
    },
    async signIn() {
      this.processing = true;
      try {
        const { success, response } = await auth.signIn({
          email: this.email,
          password: this.password,
        });

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
    this.email = this.signUpDetails?.email || '';
  },
};
</script>

<style scoped>
.mb-2 {
  margin-bottom: 20px;
}

.mb-5 {
  margin-bottom: 44px;
}
</style>
