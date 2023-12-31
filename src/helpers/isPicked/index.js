const notPicked = (obj, arr = []) => {
  if (!Array.isArray(arr)) {
    throw new TypeError(
      `${arr} argument 2 expects array but received ${typeof arr}`,
    );
  }

  return arr.map(a => !obj[a]).reduce((a, c) => a && c);
};

export default notPicked;
