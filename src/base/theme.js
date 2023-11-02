export const colors = {
  purple: '#2E3192',
  'dark-blue': '#0C103A',
  'tinted-blue': '#85879C',
  white: '#FFFFFF',
  orange: '#FBB03B',
  'bad-red': '#FF5E5E',
  'good-green': '#25CC68',
  ongoing: '#597FEB',
  'particle-background': '#C4C4C4',
  background: '#f7f7f7',
  'warning-yellow': '#FFE347',
  'ghost-white-background': '#F6F7FF',
  'badge-background': 'rgba(251, 176, 59, 0.4)',
  blue: '#6EE0ED',
  'pale-purple': '#7D7ABC',
  disabled: '#B6B7C4',
  text: {
    secondary: {
      main: '#0C103A',
      light: 'rgba(12,16,58,0.6)',
      lighter: 'rgba(12, 16, 58, 0.4)',
    },
  },
};

export const tabs = {
  active: {
    'hover-background': '#',
    background: colors.purple,
    color: '#FFFFFF',
  },
  inactive: {
    'hover-background': '#D5D6E9',
    background: '#ffffff',
    color: colors.purple,
  },
};

export const button = {
  general: {
    background: '#B6B7C4',
  },
  primary: {
    background: colors.purple,
    border: colors.purple,
    background_hover: '#3A3E60',
    color: '#FFFFFF',
  },
  secondary: {
    background: 'transparent',
    border: colors['dark-blue'],
    background_hover: colors['dark-blue'],
    color: colors['dark-blue'],
    color_hover: '#FFFFFF',
  },
  destructive: {
    background: colors['bad-red'],
    border: colors['bad-red'],
    background_hover: '#E55555',
    color: '#FFFFFF',
  },
};

export const input = {
  general: {
    border: colors.purple,
    active_border: colors.purple,
  },
  error: {
    border: colors['bad-red'],
  },
  success: {
    border: colors['good-green'],
  },
  warning: {
    border: colors['warning-yellow'],
  },
};

export const theme = {
  colors,
  button,
  input,
  tabs,
  fontFamily(family = 'Epilogue') {
    return `
  '${family}',-apple-system,BlinkMacSystemFont,"Helvetica Neue",
  "Segoe UI","Oxygen","Ubuntu","Cantarell","Open Sans",sans-serif
  `;
  },
};

export default theme;
