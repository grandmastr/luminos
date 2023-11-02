const setPosition = (arr, item, index) => {
  return !arr.length
    ? index + 1
    : arr[index - 1]?.completed_swaps === item?.completed_swaps
    ? arr[index - 1]?.position
    : arr[index - 1]?.position + 1;
};

export default setPosition;
