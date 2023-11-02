const getFirstName = (fName = 'John Doe') => {
  if (typeof fName !== 'string') {
    throw TypeError(`Type string expected, got ${typeof fName}`);
  }

  return fName.split(' ')[0];
};

export default getFirstName;
