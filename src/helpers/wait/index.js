const wait = async (callback, time = 1000) => {
  try {
    setTimeout(await callback, time);
  } catch (e) {
    throw new Error(e);
  }
};

export default wait;
