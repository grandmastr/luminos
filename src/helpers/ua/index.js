const inBrowser = function inBrowser() {
  return typeof window !== 'undefined';
};
const isMacintosh = function isMacintosh() {
  return inBrowser() && navigator.platform.indexOf('Mac') > -1;
};
const isWindows = function isWindows() {
  return inBrowser() && navigator.platform.indexOf('Win') > -1;
};
const UA = inBrowser() && window.navigator.userAgent.toLowerCase();

const isIE = function isIE() {
  return UA && /msie|trident/.test(UA);
};
const isIE9 = function isIE9() {
  return UA && UA.indexOf('msie 9.0') > 0;
};
const isEdge = function isEdge() {
  return UA && UA.indexOf('edge/') > 0;
};
const isAndroid = function isAndroid() {
  return UA && UA.indexOf('android') > 0;
};
const isIOS = function isIOS() {
  return UA && /iphone|ipad|ipod|ios/.test(UA);
};
const isChrome = function isChrome() {
  return UA && /chrome\/\d+/.test(UA) && !isEdge();
};
const isPhantomJS = function isPhantomJS() {
  return UA && /phantomjs/.test(UA);
};
const isFirefox = function isFirefox() {
  return UA && UA.match(/firefox\/(\d+)/);
};

export {
  UA,
  inBrowser,
  isAndroid,
  isChrome,
  isEdge,
  isFirefox,
  isIE,
  isIE9,
  isIOS,
  isMacintosh,
  isPhantomJS,
  isWindows,
};
