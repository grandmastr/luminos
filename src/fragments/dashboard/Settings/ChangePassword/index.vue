<template>
  <container @submit.prevent="changePassword">
    <text-input
      placeholder=" "
      label="Old Password"
      type="password"
      v-model="oldPassword"
    />
    <text-input
      placeholder=" "
      label="New Password"
      type="password"
      v-model="newPassword1"
    />
    <text-input
      placeholder=" "
      label="Confirm New Password"
      type="password"
      v-model="newPassword2"
    />
    <Button text="Change Password" :disabled="disabled" />
  </container>
</template>

<script>
import styled from 'vue-styled-components';

import { Button, Input } from '@/components';
import { user } from '@/api';

const Container = styled('form')`
  padding: 1.25em 0;

  div.input-group {
    margin-bottom: 24px;
  }

  button {
    margin-top: 24px;
  }
`;

export default {
  name: 'ChangePassword',
  data() {
    return {
      oldPassword: '',
      newPassword1: '',
      newPassword2: '',
      processing: false,
    };
  },
  components: { Button, 'text-input': Input, Container },
  methods: {
    async changePassword() {
      this.processing = true;
      try {
        const data = await user.changePassword({
          oldPassword: this.oldPassword,
          newPassword1: this.newPassword1,
          newPassword2: this.newPassword2,
        });

        if (data?.success) {
          this.$emit('dismiss');
        }
      } finally {
        this.processing = false;
      }
    },
  },
  computed: {
    disabled() {
      return (
        this.oldPassword.length < 6 ||
        !this.newPassword1 ||
        !this.newPassword2 ||
        this.newPassword1 !== this.newPassword2 ||
        this.processing
      );
    },
  },
  watch: {
    newPassword2(value) {
      if (
        value.length >= this.newPassword1.length &&
        value !== this.newPassword1
      ) {
        this.$toast.error("Passwords don't match");
      }
    },
  },
};
</script>
