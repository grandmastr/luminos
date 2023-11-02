<template>
  <StyledInput
    :label="label"
    :instruction="instruction"
    :message="message"
    role="button"
    :aria-hidden="!visible"
    aria-haspopup="true"
    :aria-expanded="open"
  >
    <div class="input-group" :class="{ activeInput }">
      <input
        :disabled="disabled"
        :type="type"
        placeholder=" "
        step="any"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
        @focus="activeInput = true"
        @blur="activeInput = false"
      />
      <label for="input">{{ label }}</label>
      <span
        class="icon"
        tabindex="0"
        @click="openList"
        @keydown.enter="openList"
      >
        <template v-if="list[active].code">
          <img
            v-if="list[active].image"
            class="list-image"
            :src="list[active].image"
            :alt="list[active].name"
          />
          <component
            v-else-if="list[active].name && list[active].code"
            :is="list[active].name"
            class="list-image"
          />
          <span class="code">
            {{ list[active].code }}
          </span>
        </template>
        <i data-feather="chevron-down" style="color: rgba(12, 16, 58, 0.6)"></i>
      </span>
    </div>
    <div v-show="open" class="list" tabindex="0">
      <p v-if="instruction" class="instruction">{{ instruction }}</p>
      <ul class="list-items">
        <li
          v-for="(item, index) in list"
          :key="index"
          v-show="index !== active"
          class="list-item"
          :class="{ unactive: index !== active }"
          tabindex="0"
          @click="chooseActive(index)"
          @keydown.enter="chooseActive(index)"
        >
          <img
            v-if="list.image"
            class="list-image"
            :src="item.image"
            :alt="item.name"
          />
          <component
            v-else-if="list.name && list.code"
            :is="item.name"
            class="list-image"
          />
          {{ item.name }} <span v-if="item.code">({{ item.code }})</span>
        </li>
      </ul>
    </div>
    <small class="message" v-if="message">{{ message }}</small>
  </StyledInput>
</template>

<script>
import styled from 'vue-styled-components';
import mixin from './mixin';

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
import { cryptos } from '@/lib';

const StyledInput = styled.div`
   {
    position: relative;

    .code {
      color: ${({ theme }) => theme.colors.text.secondary.light};
      font-weight: 500;
      font-size: 0.875em;
    }

    .input-group {
      position: relative;
      border-radius: 8px;
      border: 1.5px solid ${({ theme }) => theme.colors.purple};
      transition: 0.3s border ease;

      &.activeInput {
        border-color: ${({ theme }) => theme.colors.orange};
      }

      label {
        position: absolute;
        top: 50%;
        left: 16px;
        transform: translateY(-50%);
        text-transform: normal;
        color: #85879c;
        font-size: 12px;
        transition: 0.5s all cubic-bezier(0.68, -0.6, 0.32, 1.6);
        z-index: -1;
      }

      input {
        display: block;
        padding: 16px;
        background: none;
        max-width: 55%;
        border: none;

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        &[type='number'] {
          -moz-appearance: textfield;
        }

        ::placeholder {
          color: ${({ theme }) => theme.colors.purple};
          visibility: hidden;
          opacity: 0;
        }

        &:focus,
        &:active,
        &:not(:placeholder-shown) {
          /* border: 1.5px solid ${({ theme }) => theme.colors.purple}; */

          + label {
            top: -9px;
            left: 12px;
            transform: translateY(0%);
            color: ${({ theme }) => theme.colors.purple};
            background: ${({ theme }) => theme.colors.white};
            z-index: 1;
            padding: 0 8px;
          }
        }
      }

      .icon {
        position: absolute;
        overflow: hidden;
        top: 50%;
        right: 16px;
        transform: translateY(-50%);
        display: flex;
        align-items: center;

        .list-image {
          margin-right: 8px;
          max-height: 24px;
        }

        span {
          opacity: 0.4;
        }

        svg {
          margin-left: 10.36px;
          cursor: pointer;
        }
      }
    }

    .list {
      position: absolute;
      width: 100%;
      margin-top: calc(28.28px / 2);
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0px 4px 22px rgba(0, 0, 0, 0.1);
      padding-top: 24px;
      padding-bottom: calc(24px - 16px);
      z-index: 10000000;

      &:after {
        content: '';
        position: absolute;
        width: 28.28px;
        height: 28.28px;
        border-radius: 4px;
        background: #ffffff;
        transform: rotate(45deg) translateX(-50%);
        left: 50%;
        top: 0;
      }

      .instruction {
        font-weight: 500;
        font-size: 12px;
        text-transform: uppercase;
        color: ${({ theme }) => theme.colors['dark-blue']};
        opacity: 0.4;
        letter-spacing: 0.1em;
        font-variant: small-caps;
        margin-top: 0;
        padding: 0 24px;
      }

      .list-items {
        height: 150px;
        overflow-y: auto;

        &::-webkit-scrollbar {
          width: 0;
          background: transparent;
          display: none;
        }
      }

      .list-item {
        display: flex;
        align-items: center;
        padding: 16px 24px;
        cursor: pointer;

        &:hover,
        &:focus {
          background: ${({ theme }) => theme.colors['dark-blue']};
          color: ${({ theme }) => theme.colors.white};
        }

        .list-image {
          margin-right: 12.31px;
        }

        span {
          opacity: 0.4;
        }
      }
    }

    small {
      font-size: 12px;
      color: #85879c;
      font-weight: 500;
      display: block;
      line-height: 16.8px;

      &.message {
        color: ${({ theme }) => theme.colors.purple};
        margin-top: 5px;
      }
    }
  }
`;

export default {
  name: 'Dropdown',
  mixins: [mixin],
  components: {
    StyledInput,
    Fiat,
    Bitcoin,
    Ethereum,
    Tether,
    Tron,
    Dash,
    Doge,
    Litecoin,
  },
  props: {
    list: {
      type: Array,
      required: false,
      default() {
        return cryptos;
      },
    },
  },
};
</script>
