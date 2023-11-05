const symbolToAsset = (symbol = 'btc') => {
  switch (symbol.toLowerCase()) {
    case 'btc':
      return 'bitcoin';
    case 'ngn':
    case 'fiat':
      return 'fiat';
    case 'eth':
      return 'ethereum';
    case 'doge':
      return 'doge';
    case 'ltc':
      return 'litecoin';
    case 'trx':
      return 'tron';
    case 'dash':
      return 'dash';
    case 'usdt':
      return 'tether';
    case 'xlm':
      return 'doge';
    default:
      return 'bitcoin';
  }
};

export default symbolToAsset;
