import { css } from 'vue-styled-components';

import { maxWidth as MW, BREAKPOINTS } from '@/constants';
import { toPx } from '@/helpers';

export const setMaxWidth = (value = MW) => {
  return css`
    max-width: ${Number(value) ? `${value}px` : 'none'};
    width: 100%;
    margin: auto;
  `;
};

const breakpoints = Object.keys(BREAKPOINTS).reduce((acc, curr) => {
  const currentValue = BREAKPOINTS[curr];

  return Object.assign(acc, {
    [curr]: currentValue,
    [`>${curr}`]: currentValue + 1,
    [`<${curr}`]: currentValue - 1,
  });
}, {});

const computedValue = breakpoint => {
  return breakpoint in breakpoints ? toPx(breakpoints[breakpoint]) : breakpoint;
};

const maxWidth = value => (...content) => css`
  @media (max-width: ${computedValue(value)}) {
    ${css(...(content || ''))}
  }
`;

const minWidth = value => (...content) => css`
  @media (min-width: ${computedValue(value)}) {
    ${css(...(content || ''))};
  }
`;

const between = (min, max) => (...content) => css`
  @media (min-width: ${computedValue(min)}) and (max-width: ${computedValue(
      max,
    )}) {
    ${css(...(content || ''))}
  }
`;

export const query = {
  maxWidth,
  minWidth,
  between,
  breakpoints,
};
