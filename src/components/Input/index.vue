<template>
  <StyledInput
    :state="state"
    :icon="icon"
    :placeholder="placeholder"
    :label="label"
    :help="help"
    :message="message"
    role="textbox"
    :aria-hidden="!visible"
    @click="$emit('clicked')"
  >
    <div class="input-group">
      <input
        :id="id"
        :type="localType"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
      <label :for="id">{{ label }}</label>
      <span class="icon">
        <slot>
          <div v-if="type === 'password'">
            <Eye
              role="button"
              v-if="localType === 'password'"
              @click="localType = 'text'"
            />
            <EyeOff role="button" v-else @click="localType = 'password'" />
          </div>
          <i v-else-if="icon" :data-feather="icon"></i>
        </slot>
      </span>
    </div>
    <small class="message" v-if="message">{{ message }}</small>
    <small>{{ help }}</small>
  </StyledInput>
</template>

<script>
import styled from 'vue-styled-components';
import { Eye, EyeOff } from '@/assets';

const inputProps = {
  state: {
    type: String,
    required: false,
    default() {
      return 'general';
    },
  },
};

const StyledInput = styled('div', inputProps)`
   {
    background-color: inherit;

    .input-group {
      position: relative;
      background-color: inherit;

      label {
        position: absolute;
        top: 50%;
        left: 16px;
        transform: translateY(-50%);
        text-transform: capitalize;
        color: #85879c;
        font-size: 12px;
        transition: 0.5s all cubic-bezier(0.68, -0.6, 0.32, 1.6);
      }

      input {
        border-radius: 8px;
        border: 2px solid ${({ theme, state }) => theme.input[state].border};
        transition: 0.3s border ease;
        display: block;
        padding: 16px;
        background-color: inherit;
        width: 100%;
        outline-color: transparent;

        ::placeholder {
          color: ${({ theme, state }) => theme.input[state].border};
          visibility: hidden;
          opacity: 0;
        }

        &:focus,
        &:focus-within,
        &:active,
        &:not(:placeholder-shown) {
          border: 1.5px solid ${({ theme }) => theme.colors.orange};

          + label {
            top: -6px;
            left: 12px;
            transform: translateY(0%);
            background-color: ${({ theme }) => theme.colors.white};
            z-index: 1;
            padding: 0 8px;
          }
        }
      }

      .icon {
        position: absolute;
        max-height: 24px;
        overflow: hidden;
        top: 50%;
        right: 16px;
        transform: translateY(-50%);
        color: ${({ theme, state }) => theme.input[state].border};
      }
    }

    small {
      font-size: 12px;
      color: #85879c;
      font-weight: 500;
      display: block;
      line-height: 16.8px;

      &.message {
        color: ${({ theme, state }) => theme.input[state].border};
        margin-top: 5px;
      }
    }
  }
`;

export default {
  name: 'Input',
  components: {
    StyledInput,
    Eye,
    EyeOff,
  },
  data() {
    return {
      localType: this.type,
    };
  },
  computed: {
    id() {
      return 'id' + (Math.random() * 10).toString(36);
    },
  },
  props: {
    value: [Number, String],
    autocomplete: String,
    visible: {
      type: Boolean,
      required: false,
      default() {
        return true;
      },
    },
    disabled: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
    state: String,
    icon: String,
    type: {
      type: String,
      required: false,
      default() {
        return 'text';
      },
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: String,
    help: String,
    message: String,
  },
  async mounted() {
    if (this.icon) {
      const feather = await import('feather-icons');
      feather.replace({
        width: '24px',
        height: '24px',
      });
    }
  },
};
</script>
