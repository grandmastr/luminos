const formatAmount = (amount, currency = 'NGN') => {
  return new Intl.NumberFormat(document.documentElement.lang || 'en-NG', {
    style: 'currency',
    currency,
  }).format(amount);
};

export default formatAmount;
