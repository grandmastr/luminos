<template>
  <Popup>
    <h2>How long would you like to lock your cash</h2>
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
      text="Send application"
      styles="font-size: 14px"
      @click="next"
      :disabled="disabled"
    />
  </Popup>
</template>

<script>
import { Button } from '@/components';
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

    div[label='Lock duration'] {
      margin-bottom: 200px;
    }
  }
`;

export default {
  components: {
    Popup,
    Button,
  },
  data() {
    return {
      option: '',
    };
  },
  computed: {
    disabled() {
      return !this.option || this.processing;
    },
  },
  props: {
    options: {
      type: Array,
      required: false,
      default() {
        return ['3 Months'];
      },
    },
    processing: Boolean,
  },
  methods: {
    setOption(item) {
      sessionStorage.setItem('ppld', item);
      return this.option === item ? (this.option = '') : (this.option = item);
    },
    next() {
      this.$emit('goToNext', this.option.split(' ')[0]);
    },
  },
  mounted() {
    this.option = sessionStorage.getItem('ppld') || '';
  },
};
</script>
