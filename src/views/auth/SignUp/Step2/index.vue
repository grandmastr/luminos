<template>
  <main>
    <SignUpHead text="Enter your name" />
    <Input
      type="First Name"
      label="First Name"
      placeholder=" "
      v-model="firstName"
      autocomplete="given-name"
      class="mb-2"
    ></Input>
    <Input
      type="Last Name"
      label="Last Name"
      placeholder=" "
      v-model="lastName"
      autocomplete="family-name"
      class="mb-5"
    ></Input>
    <router-link to="./step-3">
      <Button
        text="Next"
        @click="clickEvent"
        :disabled="!(firstName && lastName)"
        styles="margin-top: auto"
      ></Button>
    </router-link>
  </main>
</template>

<script>
import signUpMixin from '@/views/auth/SignUp/signUpMixin';

export default {
  name: 'Name',
  mixins: [signUpMixin],
  data() {
    return {
      firstName: '',
      lastName: 'null',
    };
  },
  methods: {
    clickEvent() {
      this.setSignUpDetails({
        name: `${this.firstName} ${this.lastName}`,
      });
      this.$router.push('./step-3');
    },
  },
  mounted() {
    this.firstName = this.signUpDetails?.name?.split(' ')[0] || '';
    this.lastName = this.signUpDetails?.name?.split(' ')[1] || '';
  },
};
</script>

<style scoped>
.mb-2 {
  margin-bottom: 24px;
}

.mb-5 {
  margin-bottom: 44px;
}
</style>
