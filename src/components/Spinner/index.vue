<template>
  <spinner-container
    class="spinner"
    role="progressbar"
    :aria-valuetext="value"
    :size="size"
  >
    <div />
  </spinner-container>
</template>

<script>
import styled, { keyframes } from 'vue-styled-components';

const sizes = {
  small: 30,
  default: 45,
  large: 60,
};

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const spinnerProps = {
  size: {
    type: 'small' | 'default' | 'large' | Number,
    required: false,
    default() {
      return 'default';
    },
  },
};

const SpinnerContainer = styled('div', spinnerProps)`
  height: ${({ size }) => (typeof size === 'string' ? sizes[size] : size)}px;
  width: ${({ size }) => (typeof size === 'string' ? sizes[size] : size)}px;
  margin: auto;
  place-self: center;
  border-radius: 50%;
  border: 0.12em solid;
  border-color: #eaeafc;
  border-top-color: ${({ theme }) => theme.colors.purple};
  animation: ${rotate} 500ms infinite;
`;

export default {
  name: 'Spinner',
  components: {
    SpinnerContainer,
  },
  props: {
    ...spinnerProps,
    value: {
      type: String,
      required: false,
      default() {
        return 'processing';
      },
    },
  },
};
</script>
