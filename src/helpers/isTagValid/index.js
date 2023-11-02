const isTagValid = tag => {
  if (tag.toLowerCase() === 'monkeyprince') return true;

  return /^@([a-z0-9_]){2,11}$/.test(tag);
};

export default isTagValid;
