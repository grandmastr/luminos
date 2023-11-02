<template>
  <StyledButton
    v-if="type === 'button'"
    :state="state"
    :size="size"
    :text="text"
    :width="width"
    :styles="styles"
    :disabled="disabled"
    :icon="icon"
    role="button"
    :aria-hidden="!visible"
    @click="$emit('click')"
  >
    <slot><i v-if="icon" :data-feather="icon"></i>{{ text }}</slot>
  </StyledButton>
  <StyledLink
    v-else-if="type === 'link'"
    :state="state"
    :size="size"
    :text="text"
    :width="width"
    :styles="styles"
    :icon="icon"
    :aria-hidden="!visible"
    @click="$emit('click')"
  >
    <slot><i v-if="icon" :data-feather="icon"></i>{{ text }}</slot>
  </StyledLink>
</template>

<script>
import styled from 'vue-styled-components';

const sizes = {
  default: '14px 48px',
  medium: '10px 48px',
  small: '6px 48px',
};

const btnProps = {
  state: {
    type: String,
    required: false,
    default() {
      return 'primary';
    },
  },
  size: {
    type: String,
    required: false,
    default() {
      return 'default';
    },
  },
  text: {
    type: String,
    required: false,
    default() {
      return 'Button';
    },
  },
  width: {
    type: String,
    required: false,
    default() {
      return '100%';
    },
  },
  styles: String,
};

const StyledButton = styled('button', btnProps)`
   {
    padding: ${({ size }) => sizes[size]};
    background-color: ${({ theme, state }) => theme.button[state].background};
    color: ${({ theme, state }) => theme.button[state].color};
    transition: 300ms background ease;
    border: 1px solid ${({ theme, state }) => theme.button[state].border};
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${({ width }) => width};

    ${({ styles }) => styles}
    :hover {
      background-color: ${({ theme, state }) =>
        theme.button[state].background_hover};
      color: ${({ theme, state }) =>
        theme.button[state].color_hover ?? theme.button[state].color};
    }

    :disabled {
      background-color: ${({ theme }) => theme.button.general.background};
      cursor: wait;
      color: #fff;
    }

    svg {
      margin-right: 10px;
    }
  }
`;

const StyledLink = styled('a', btnProps)`
   {
    color: ${({ theme, state }) => theme.button[state].color};
    font-weight: bold;
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    line-height: 0;

    ${({ styles }) => styles}
    &:after {
      height: 2px;
      content: '';
      position: absolute;
      background: ${({ theme, state }) => theme.button[state].color};
      left: 0;
      width: 100%;
      bottom: -10px;
      border-radius: 2px;
      transition: 0.3s bottom ease;
      opacity: 0;
      visibility: hidden;
    }

    :hover {
      color: ${({ theme, state }) => theme.button[state].color};

      &::after {
        bottom: -5px;
        opacity: 1;
        visibility: visible;
      }
    }

    :disabled {
      color: ${({ theme }) => theme.button.general.background};
      cursor: wait;
    }

    svg {
      margin-right: 10px;
    }
  }
`;

export default {
  name: 'Button',
  components: {
    StyledButton,
    StyledLink,
  },
  props: {
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
    icon: String,
    type: {
      type: String,
      required: false,
      default() {
        return 'button';
      },
    },
    ...btnProps,
  },
  async mounted() {
    if (this.icon) {
      const feather = await import('feather-icons');

      feather.replace({
        width: '16px',
        height: '16px',
      });
    }
  },
};
</script>
