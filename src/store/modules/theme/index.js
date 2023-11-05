const state = () => ({
  current: localStorage.getItem('lumino_theme') || 'light',
});

export default {
  namespaced: true,
  state,
};
