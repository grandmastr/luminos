<template>
  <main>
    <SignUpHead text="Enter your email" />

    <Input
      type="email"
      label="email"
      placeholder=" "
      v-model="email"
      autocomplete="email"
      class="mb-5"
    ></Input>
    <Button
      text="Next"
      @click="clickEvent"
      :disabled="!(email && email.includes('@'))"
      styles="margin-top: auto"
    />
  </main>
</template>

<script>
import signUpMixin from '@/views/auth/SignUp/signUpMixin';

export default {
  name: 'VerifyEmail',
  mixins: [signUpMixin],
  data() {
    return {
      email: '',
    };
  },
  methods: {
    clickEvent() {
      this.setSignUpDetails({ email: this.email });
      this.$router.push('sign-up/step-4');
    },
  },
  mounted() {
    this.email = this.signUpDetails?.email || '';
  },
};
</script>

<style scoped>
.mb-5 {
  margin-bottom: 44px;
}
</style>
