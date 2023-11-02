<template>
  <StyledInput
    :state="state"
    :label="label"
    :help="help"
    :message="message"
    :maxlength="maxlength"
    role="button"
    :aria-hidden="!visible"
    @click="$emit('clicked')"
  >
    <div class="input-group">
      <textarea
        :disabled="disabled"
        v-model="text"
        :maxlength="maxlength"
        placeholder=" "
      />
      <label for="input">{{ label }}</label>
      <span class="counter">{{ count }}/ {{ maxlength }}</span>
    </div>
    <small class="message" v-if="message">{{ message }}</small>
    <small>{{ help }}</small>
  </StyledInput>
</template>

<script>
import styled from 'vue-styled-components';

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
    .input-group {
      position: relative;

      label {
        position: absolute;
        top: 16px;
        left: 16px;
        text-transform: capitalize;
        color: ${({ theme }) => theme.colors['dark-blue']};
        font-size: 12px;
        transition: 0.5s all cubic-bezier(0.68, -0.6, 0.32, 1.6);
        z-index: -1;
      }

      textarea {
        border-radius: 8px;
        border: 1.5px solid ${({ theme, state }) => theme.input[state].border};
        transition: 0.3s border ease;
        display: block;
        padding: 16px;
        background: none;
        width: 100%;

        ::placeholder {
          color: ${({ theme, state }) => theme.input[state].border};
          visibility: hidden;
          opacity: 0;
        }

        &:focus,
        &:active,
        &:not(:placeholder-shown) {
          border: 1.5px solid
            ${({ theme }) => theme.input.general.active_border};

          + label {
            top: -6px;
            left: 12px;
            transform: translateY(0%);
            background: ${({ theme }) => theme.colors.white};
            z-index: 1;
            padding: 0 8px;
            font-weight: bold;
          }
        }
      }

      .counter {
        font-size: 10px;
        float: right;
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
  name: 'Textarea',
  data() {
    return {
      text: '',
    };
  },
  components: {
    StyledInput,
  },
  computed: {
    count() {
      return this.text.length;
    },
  },
  props: {
    visible: Boolean,
    disabled: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
    state: String,
    label: {
      type: String,
      required: true,
    },
    help: String,
    message: String,
    maxlength: {
      type: Number,
      default() {
        return 120;
      },
    },
  },
};
</script>
