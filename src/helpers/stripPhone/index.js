const stripPhone = phone => {
  if (phone) {
    return phone.replace(/[+]?234/, '0');
  }
};

export default stripPhone;
