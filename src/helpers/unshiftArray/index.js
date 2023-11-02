const unshiftArray = (array, key, value, shallow = false) => {
  if (Array.isArray(array)) {
    const copiedArr = [...array];

    copiedArr.forEach((item, index) => {
      if (shallow ? item : item[key] === value) {
        array.splice(1, index);
        array.unshift(item);
      }
    });

    return copiedArr;
  }

  throw new TypeError('Type array expected as first argument');
};

export default unshiftArray;
