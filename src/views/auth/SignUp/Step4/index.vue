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

export default {
  name: 'Password',
  mixins: [signUpMixin],
  data() {
    return {
      password: null,
    };
  },
  methods: {
    clickEvent() {
      this.setSignUpDetails({ password: this.password });
      this.$router.push('./step-5');
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
