<template>
  <Popup>
    <h2>How much would you like to commit?</h2>
    <Input v-model="option" label="Pool size" disabled />
    <div class="grid">
      <div
        v-for="item in options"
        :key="item"
        class="grid-item"
        :class="{ active: option === item }"
        @click="setOption(item)"
      >
        <p>{{ item }}</p>
      </div>
    </div>
    <Button
      text="Next"
      styles="font-size: 14px; margin-top: 98px"
      :disabled="disabled"
      @click="next"
    />
  </Popup>
</template>

<script>
import { Button, Input } from '@/components';
import styled from 'vue-styled-components';

const Popup = styled('article')`
   {
    text-align: center;
    padding: 45px 0;

    h2 {
      font-family: ${({ theme }) => theme.fontFamily('Fraunces')};
      color: ${({ theme }) => theme.colors.purple};
      margin: 0 auto 21px auto;
    }

    .grid {
      padding: 24px 0;
      display: flex;
      flex-wrap: wrap;
      flex-grow: 1;

      .grid-item {
        padding: 12px;
        background: ${({ theme }) => theme.colors['ghost-white-background']};
        color: ${({ theme }) => theme.colors.purple};
        border-radius: 8px;
        margin-right: 16px;
        margin-bottom: 16px;
        cursor: pointer;
        transition: 0.2s all ease;

        p {
          margin: 0;
        }

        &.active {
          background: ${({ theme }) => theme.colors.purple};
          color: ${({ theme }) => theme.colors.white};
        }
      }
    }
  }
`;

export default {
  components: {
    Popup,
    Button,
    Input,
  },
  props: {
    options: {
      type: Array,
      required: false,
      default() {
        return ['₦500,000', '₦1,000,000'];
      },
    },
  },
  data() {
    return {
      option: '₦',
    };
  },
  methods: {
    setOption(item) {
      sessionStorage.setItem('ppam', item);
      return this.option === item ? (this.option = '₦') : (this.option = item);
    },
    next() {
      this.$emit('goToNext', this.option.replaceAll(',', '').replace('₦', ''));
    },
  },
  computed: {
    disabled() {
      return !this.option || this.option === '₦';
    },
  },
  mounted() {
    this.option = sessionStorage.getItem('ppam') || '₦';
  },
};
</script>
