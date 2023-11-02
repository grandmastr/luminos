<template>
  <div class="row" role="button" @click="showDetails">
    <span id="swapType">
      {{ swap.have | symbolToAsset | capitalize }} ({{ swap.have }}) -
      {{ swap.want }}
    </span>
    <span aria-labelledby="swapType">
      {{
        (swap.have === 'NGN' ? swap.amount / 100 : swap.amount) | formatNumber
      }}
      {{ swap.have }}
      <span :class="swap.status"> -> </span>
      {{ swap.want }}
    </span>
    <div class="coin-images">
      <component :is="swap.have | symbolToAsset" class="have-coin" />
      <component :is="swap.want | symbolToAsset" class="want-coin" />
    </div>
    <span
      v-if="!!(swap.amount - swap.left_amount)"
      class="percentage"
      aria-label="percentage completion"
      >{{ ((swap.amount - swap.left_amount) / swap.amount) * 100 }}% Complete
    </span>
    <hr />
  </div>
</template>

<script>
import feather from 'feather-icons';
import { mapMutations } from 'vuex';

import {
  Bitcoin,
  Dash,
  Doge,
  Ethereum,
  Fiat,
  Litecoin,
  Tether,
  Tron,
} from '@/assets';

export default {
  name: 'SwapTransaction',
  props: {
    swap: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    feather.replace();
  },
  methods: {
    showDetails() {
      // this.$emit('click', this.swap);
    },
    ...mapMutations('user', ['setActiveTransaction']),
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Tether,
    // eslint-disable-next-line vue/no-unused-components
    Ethereum,
    // eslint-disable-next-line vue/no-unused-components
    Fiat,
    // eslint-disable-next-line vue/no-unused-components
    Bitcoin,
    // eslint-disable-next-line vue/no-unused-components
    Tron,
    // eslint-disable-next-line vue/no-unused-components
    Doge,
    // eslint-disable-next-line vue/no-unused-components
    Dash,
    // eslint-disable-next-line vue/no-unused-components
    Litecoin,
  },
};
</script>
