const assetToSymbol = (symbol = 'btc') => {
  switch (symbol.toLowerCase()) {
    case 'fiat':
      return 'NGN';
    case 'bitcoin':
      return 'BTC';
    case 'ethereum':
      return 'ETH';
    case 'doge':
      return 'DOGE';
    case 'tron':
      return 'TRX';
    case 'dash':
      return 'DASH';
    case 'tether':
      return 'USDT';
    case 'litecoin':
      return 'LTC';
    default:
      return 'BTC';
  }
};

export default assetToSymbol;
