import NProgress from 'nprogress';

const nprogress = {
  start: () => {
    // eslint-disable-next-line no-unused-expressions
    NProgress?.start();
    const progress = document.getElementById('nprogress');
    const spinner = progress.querySelector('.spinner');

    progress.setAttribute('aria-busy', 'true');
    spinner.setAttribute('role', 'progressbar');
  },
  done: () => NProgress?.done(),
  inc: value => NProgress?.inc(value),
  configure: NProgress?.configure,
};

export default nprogress;
