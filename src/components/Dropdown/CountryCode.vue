<template>
  <StyledInput
    :label="label"
    :instruction="instruction"
    :message="message"
    role="button"
    :aria-hidden="!visible"
  >
    <div class="input-group" :class="{ activeInput: activeInput }">
      <span
        v-show="type === 'tel'"
        class="icon"
        tabindex="0"
        @click="openList"
        @keydown.enter="openList"
      >
        {{ list[active].dial_code }}
        <i data-feather="chevron-down"></i>
      </span>
      <input
        :disabled="disabled"
        :type="type"
        placeholder=" "
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
        @focus="activeInput = true"
        @blur="activeInput = false"
      />
      <label for="input">{{ label }}</label>
      <span
        v-show="type !== 'tel'"
        class="icon"
        tabindex="0"
        @click="openList"
        @keydown.enter="openList"
      >
        <i data-feather="chevron-down"></i>
      </span>
    </div>
    <div v-show="open" class="list">
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
          <div class="image" v-if="item.img && showImage">
            <img :src="item.img" :alt="'flag of ' + item.name" />
          </div>
          {{ item.name }}
          <span v-if="item.dial_code">({{ item.dial_code }})</span>
        </li>
      </ul>
    </div>
    <small class="message" v-if="message">{{ message }}</small>
  </StyledInput>
</template>

<script>
import styled from 'vue-styled-components';
import mixin from './mixin';

const StyledInput = styled.div`
   {
    position: relative;

    .input-group {
      position: relative;
      border-radius: 8px;
      border: 1.5px solid ${({ theme }) => theme.colors.purple};
      transition: 0.3s border ease;
      display: flex;
      align-items: center;

      &.activeInput {
        border-color: ${({ theme }) => theme.colors.orange};
      }

      label {
        position: absolute;
        top: 50%;
        left: 16px;
        transform: translateY(-50%);
        text-transform: capitalize;
        color: #85879c;
        font-size: 12px;
        transition: 0.5s all cubic-bezier(0.68, -0.6, 0.32, 1.6);
        z-index: -1;
      }

      input {
        display: block;
        padding: 16px;
        background: none;
        border: none;
        width: 100%;

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
        padding-left: 16px;
        padding-right: 16px;
        display: flex;
        align-items: center;
        opacity: 0.4;

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
        height: 300px;
        overflow-y: auto;
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

        .image {
          width: 42.41px;
          height: 42.41px;
          background: ${({ theme }) => theme.colors['ghost-white-background']};
          padding: 8px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          margin-right: 15.87px;
        }

        span {
          opacity: 0.4;
          margin-left: 8px;
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
  },
  props: {
    list: {
      type: Array,
      required: false,
      default() {
        return [
          {
            name: 'Nigeria',
            dial_code: '+234',
            code: 'NG',
            img: 'https://flagcdn.com/32x24/ng.png',
          },
          {
            name: 'United Kingdom',
            dial_code: '+44',
            code: 'GB',
            img: 'https://flagcdn.com/32x24/gb.png',
          },
          {
            name: 'United States',
            dial_code: '+1',
            code: 'US',
            img: 'https://flagcdn.com/32x24/us.png',
          },
          {
            name: 'China',
            dial_code: '+86',
            code: 'CN',
            img: 'https://flagcdn.com/32x24/cn.png',
          },
          {
            name: 'Canada',
            dial_code: '+1',
            code: 'CA',
            img: 'https://flagcdn.com/32x24/ca.png',
          },
          {
            name: 'Australia',
            dial_code: '+61',
            code: 'AU',
            img: 'https://flagcdn.com/32x24/au.png',
          },
          {
            name: 'South Africa',
            dial_code: '+27',
            code: 'ZA',
            img: 'https://flagcdn.com/32x24/za.png',
          },
          {
            name: 'Ghana',
            dial_code: '+233',
            code: 'GH',
            img: 'https://flagcdn.com/32x24/gh.png',
          },
          {
            name: 'Kenya',
            dial_code: '+254',
            code: 'KE',
            img: 'https://flagcdn.com/32x24/ke.png',
          },
          {
            name: 'Rwanda',
            dial_code: '+250',
            code: 'RW',
            img: 'https://flagcdn.com/32x24/rw.png',
          },
        ];
      },
    },
    showImage: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
