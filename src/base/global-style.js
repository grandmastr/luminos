import { injectGlobal } from 'vue-styled-components';

import theme from '@/base/theme';
import { query } from '@/helpers';

const { fontFamily, colors } = theme;

injectGlobal`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  :focus {
    outline: dashed 0.2em transparent;
  }

  ::selection {
    // selection background color
  }

  ::placeholder {
    opacity: 1;
  }

  html {
    width: 100%;
    position: relative;
    font-family: ${fontFamily()};
    text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${({ theme }) => theme.colors.white};

    ${query.maxWidth('large1')`
      background-color: ${({ theme }) =>
        theme.colors['ghost-white-background']};
    `};

    .fade-enter-active,
    .fade-leave-active {
      transition-duration: 300ms;
      transition-property: opacity;
      transition-timing-function: ease-in-out;
    }

    .fade-enter,
    .fade-leave-to {
      opacity: 0;
    }

    .slide-enter-active, .slide-leave-active {
      transition: 300ms ease-in-out opacity, 200ms ease-in-out transform;
    }

    .slide-enter, .slide-leave-to {
      opacity: 0;
      transform: translateY(100%);
    }

    #nprogress {
      pointer-events: none;
    }

    #nprogress .bar {
      position: fixed;
      z-index: 1031;
      top: 0;
      left: 0;

      width: 100%;
      background: ${colors.orange};
      height: 3px;
    }

    /* Fancy blur effect */

    #nprogress .peg {
      display: block;
      position: absolute;
      right: 0;
      width: 100px;
      height: 100%;
      opacity: 1;

      -webkit-transform: rotate(3deg) translate(0px, -4px);
      -ms-transform: rotate(3deg) translate(0px, -4px);
      transform: rotate(3deg) translate(0px, -4px);

      box-shadow: 0 0 10px ${colors.orange},
      0 0 ${colors.orange};
    }

    /* Remove these to get rid of the spinner */

    #nprogress .spinner {
      display: block;
      position: fixed;
      z-index: 1031;
      top: 15px;
      right: 15px;
    }

    #nprogress .spinner-icon {
      width: 18px;
      height: 18px;
      box-sizing: border-box;

      border: solid 2px transparent;
      border-radius: 50%;

      -webkit-animation: nprogress-spinner 400ms linear infinite;
      animation: nprogress-spinner 400ms linear infinite;

      border-top-color: ${colors.purple};
      border-left-color: ${colors.purple};
    }

    .nprogress-custom-parent {
      overflow: hidden;
      position: relative;
    }

    .nprogress-custom-parent #nprogress .spinner,
    .nprogress-custom-parent #nprogress .bar {
      position: absolute;
    }

    @-webkit-keyframes nprogress-spinner {
      0% {
        -webkit-transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
      }
    }
    @keyframes nprogress-spinner {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }

  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font: inherit;
    font-weight: normal;
    line-height: inherit;
    -webkit-font-smoothing: inherit;
    -moz-osx-font-smoothing: inherit;

    ${query.maxWidth('large1')`
      overscroll-behavior-y: contain;
      overflow-x: hidden;
    `}
  }

  main:focus {
    outline: none;
  }

  ul, ol, li {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  a {
    text-decoration: none;
    transition-duration: 300ms;
    transition-property: opacity, color, background-color, transform, border;
  }

  button,
  [role='button']
  input[type='submit'] {
    margin: 0;
    padding: 0;
    border: none;
    cursor: pointer;
    border-radius: 0;
    appearance: none;
  }

  input,
  button,
  textarea {
    border-radius: 0;
    -webkit-tap-highlight-color: transparent;
  }

  textarea {
    resize: none;
  }

  textarea,
  [type='tel'],
  [type='text'],
  [type='email'],
  [type='search'],
  [type='password'] {
    &:focus {
      outline-color: transparent;
    }
  }

  textarea,
  [type='tel'],
  [type='text'],
  [type='email'],
  [type='search'],
  [type='password'] {
    /* disable ugly styles for invalid inputs */

    &:required,
    &:invalid {
      box-shadow: none;
    }
  }

  /* disable ugly webkit autofill styles */
  input:-webkit-autofill {
    color: transparent !important;
    background-image: none !important;
    background-color: #fff !important;
    -webkit-box-shadow: 0 0 0 1000px none inset !important;
    -webkit-text-fill-color: rgba(61, 21, 95, .7) !important;
  }

  img {
    width: auto;
    height: auto;
    display: block;
    max-width: 100%;
    user-select: none;
  }

  #app {
    position: relative;
  }

  .no-scroll {
    overflow: hidden !important;
  }

  .visually-hidden {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    white-space: nowrap;
  }

  #skip-link {
    top: -4em;
    z-index: 1001;
    color: #eeffff;
    user-select: none;
    padding: 8px 15px;
    font-size: 14.5px;
    position: absolute;
    transition: top .2s;
    border-bottom-right-radius: 3px;

    &:focus {
      top: 0;
      left: 0;
      outline: none;
    }
  }

  .say-hello {
    color: #cbc9e2;
    letter-spacing: 0.25em;
    text-transform: uppercase;
  }

  [role='button'] {
    cursor: pointer;
  }
`;
