// This file should never be part of a webpack build.
// It is loaded before the whole app and serves as a
// runtime config.
//
// The motivation is to have only a single docker image
// build that is populated with env-specific configuration
// during container startup.
window.env = {
  WT_SEARCH_API: 'https//localhost:1918',
  WT_READ_API: 'http://localhost:3000',
  WT_SIGN_BOOKING_REQUESTS: 'false', // This option has to be a string, not boolean
  ETH_NETWORK_PROVIDER: 'https://ropsten.infura.io/v3/def1927234dd483c84e21d35d0e36a95',
};
