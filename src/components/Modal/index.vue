<template>
  <transition name="fade">
    <container
      v-if="visible"
      :width="width"
      :back="back"
      :title="title"
      :titleSize="titleSize"
    >
      <div id="smModalContainer">
        <div
          class="sm-modal"
          role="dialog"
          :aria-labelledby="labelledBy"
          :aria-describedby="describedBy"
          :aria-label="label"
          :aria-hidden="!visible"
          ref="modal"
        >
          <template v-if="dismissible">
            <div class="header">
              <div v-if="back" role="button" @click="back">
                <svg
                  data-v-d378f2c6=""
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="button"
                  class="back-button"
                >
                  <rect
                    opacity=".1"
                    x=".5"
                    y=".5"
                    width="31"
                    height="31"
                    rx="5.5"
                    fill="#2E3192"
                    stroke="#2E3192"
                    stroke-linejoin="round"
                  ></rect>
                  <path
                    d="M23.374 16.904h0l-.092.005h-.01v0H8.728a.877.877 0 01-.811-.564l15.458.559zm0 0l.01-.002m-.01.002l.01-.002m0 0A.9.9 0 0024.15 16c0-.496-.387-.909-.877-.909H10.84l4.374-4.547h0l.007-.007.065-.078h0l.006-.008a.935.935 0 00-.075-1.188h0a.856.856 0 00-1.245-.003l-5.867 6.099h0l-.006.007-.065.076h0m15.348 1.46l-15.348-1.46m0 0l-.006.008m.006-.008l-.006.008m0 0a.928.928 0 00-.113.895l.113-.895zm7.078 6.11a.783.783 0 01.002 1.074m-.002-1.074l.108-.104h0s0 0 0 0l-3.236-3.363h0l-.007-.008-.075-.068h0l-.007-.006a.853.853 0 00-1.155.084.924.924 0 00-.254.639c0 .231.084.464.256.642h0l.108-.104-.108.105 4.372 3.257m-.002-1.074l-3.236-3.364 3.236 3.364zm.002 1.074a.706.706 0 01-.954.07l.954-.07z"
                    fill="#2E3192"
                    stroke="#2E3192"
                    stroke-width=".3"
                  ></path>
                </svg>
              </div>
              <h1 v-if="title" class="title">{{ title }}</h1>
              <div role="button" @click="close">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16px"
                  height="16px"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-x icon"
                  role="button"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </div>
            </div>
          </template>
          <div class="body">
            <slot />
          </div>
        </div>
        <div class="sm-modal-overlay" id="modal-overlay" />
      </div>
    </container>
  </transition>
</template>

<script>
import feather from 'feather-icons';
import styled from 'vue-styled-components';

import { MODAL_MAX_WIDTH } from '@/constants';
import { toPx } from '@/helpers';

const modalProps = {
  width: {
    required: false,
    type: String,
  },
  title: {
    type: String,
    required: false,
  },
  titleSize: {
    type: String,
    required: false,
    default: 'lg',
  },
  back: {
    type: Function,
    required: false,
  },
};

const Container = styled('div', modalProps)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  transition: visibility 200ms, opacity 200ms, background 200ms,
    backdrop-filter 200ms, -webkit-backdrop-filter 200ms;
  z-index: 999;

  div#smModalContainer {
    z-index: 1000;
    display: flex;
    place-items: center;
    place-content: center;

    .sm-modal-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2999;
      background-color: rgba(0, 0, 0, 0.4);
      padding: 1rem;
    }

    div.sm-modal {
      z-index: 3040;
      width: 90%;
      max-width: ${({ width }) => toPx(width || MODAL_MAX_WIDTH)};
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 4px 22px 5px rgba(0, 0, 0, 0.05);
      border-radius: 0.5rem;
      background-color: ${({ theme }) => theme.colors.white};

      div.header {
        height: 4.2em;
        border-bottom: 1px solid rgba(12, 16, 58, 0.1);
        display: flex;
        align-items: center;
        padding: 0 1.3rem;
        justify-content: ${({ back, title }) =>
          back || title ? 'space-between' : 'flex-end'};

        h1.title {
          ${({ titleSize, theme }) => titleStyle(titleSize, theme)};
        }

        .icon {
          background-color: rgba(46, 49, 146, 0.2);
          height: 28px;
          width: 28px;
          padding: 0.1rem;
          border-radius: 8px;
          display: grid;
          place-items: center;
          place-content: center;
          color: ${({ theme }) => theme.colors.purple};
        }

        .close {
          float: right;
        }
      }

      div.body {
        padding: 0.2rem 1.3rem;
        max-height: 70vh;
        overflow-y: auto;

        &::-webkit-scrollbar {
          width: 0;
          background: transparent;
          display: none;
        }
      }

      ~ {
        z-index: 1000;
      }
    }
  }
`;

const titleStyle = (titleSize, theme) => {
  if (titleSize === 'lg') {
    return `font-family: ${theme.fontFamily('Fraunces')};
          color: ${theme.colors.purple};
          font-size: 1.4em;`;
  } else {
    return `
          color: ${theme.colors.text.secondary.light};
          font-weight: normal;
          font-size: 14px;`;
  }
};

export default {
  name: 'Modal',
  data() {
    return {
      show: false,
      parentFocusableEl: document.querySelector('body'),
    };
  },
  components: {
    Container,
  },
  props: {
    label: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    labelledBy: String,
    describedBy: String,
    visible: Boolean,
    dismiss: {
      type: Function,
      required: false,
    },
    dismissible: {
      type: Boolean,
      required: false,
      default() {
        return true;
      },
    },
    ...modalProps,
  },
  methods: {
    getFocusableEls() {
      let focusableEls = this.$refs.modal?.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]',
      );

      focusableEls = [...(focusableEls || [])];

      const {
        0: firstFocusableEl,
        [focusableEls.length - 1]: lastFocusableEl,
      } = focusableEls;

      this.firstFocusableEl = firstFocusableEl;
      this.lastFocusableEl = lastFocusableEl;

      this.focusableEls = focusableEls;
    },
    handleKeyDown(event) {
      const TAB_CODE = 9;
      const ESC_CODE = 27;

      const handleForwardTab = () => {
        if (document.activeElement.isSameNode(this.lastFocusableEl)) {
          event.preventDefault();
          this.firstFocusableEl.focus();
        }
      };

      const handleBackwardTab = () => {
        if (document.activeElement.isSameNode(this.firstFocusableEl)) {
          event.preventDefault();
          this.lastFocusableEl.focus();
        }
      };

      switch (event.keyCode) {
        case TAB_CODE:
          if (!!this.focusableEls.length && this.focusableEls.length === 1) {
            event.preventDefault();
            break;
          }

          if (event.shiftKey) {
            handleBackwardTab();
          } else {
            handleForwardTab();
          }

          break;
        case ESC_CODE:
          this.close();
      }
    },
    focusOnFirstEl() {
      if (!this.focusableEls.length) {
        return;
      }

      this.$nextTick(() => this.firstFocusableEl.focus());
    },
    getActiveEl() {
      this.parentFocusableEl = document.activeElement;
    },
    close() {
      if (typeof this.dismiss === 'function') {
        this.dismiss();
      }

      this.getActiveEl();
      this.parentFocusableEl.focus();
    },
    handleOutsideClick(event) {
      if (!this.$refs.modal?.contains(event.target)) {
        this.close();
      }
    },
  },
  mounted() {
    feather.replace();
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('mousedown', this.handleOutsideClick);
  },
  watch: {
    visible(newValue) {
      this.show = newValue;

      if (newValue) {
        this.$nextTick(function () {
          this.getFocusableEls();
          this.getActiveEl();
          this.focusOnFirstEl();
        });

        document.querySelector('body').style.overflow = 'hidden';
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('mousedown', this.handleOutsideClick);
      } else {
        document.querySelector('body').style.overflow = 'auto';
      }
    },
  },
};
</script>
