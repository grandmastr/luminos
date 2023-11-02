<template>
  <auth-layout>
    <container>
      <router-view />
    </container>
  </auth-layout>
</template>

<script>
import styled from 'vue-styled-components';
import { AuthLayout } from '@/layouts';

const Container = styled.div`
  padding: 0.6em;
`;

export default {
  components: {
    AuthLayout,
    Container,
  },
};
</script>
