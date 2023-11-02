import toast from 'vue-m-message';

const copy = async data => {
  try {
    await navigator.clipboard.writeText(data);
  } catch (e) {
    // await window.clipboardData.setData('text/plain', data);
  } finally {
    toast.success('Copied to clipboard');
  }
};

export default copy;
