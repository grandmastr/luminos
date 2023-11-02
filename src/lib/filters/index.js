import Vue from 'vue';
import {
  assetToSymbol,
  capitalize,
  formatAmount,
  formatNumber,
  isEmail,
  stripPhone,
  symbolToAsset,
} from '@/helpers';

import { monkey } from '@/lib';

Vue.filter('formatAmount', formatAmount);
Vue.filter('formatNumber', formatNumber);
Vue.filter('stripPhone', stripPhone);
Vue.filter('capitalize', capitalize);
Vue.filter('symbolToAsset', symbolToAsset);
Vue.filter('assetToSymbol', assetToSymbol);
Vue.filter('monkey', monkey);
Vue.filter('isEmail', isEmail);
Vue.filter('positions', v => {
  if (!v) return 'N/A';

  const value = v.toString();
  const lastCharacter = value[value.length - 1];

  if (v >= 11 && v <= 13) {
    return `${value}th`;
  }

  if (lastCharacter === '1') {
    return `${value}st`;
  } else if (lastCharacter === '2') {
    return `${value}nd`;
  } else if (lastCharacter === '3') {
    return `${value}rd`;
  }
  return `${value}th`;
});
