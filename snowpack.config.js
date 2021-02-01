// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    demo: { url: '/', static: false, resolve: true },
    src: { url: '/src', static: false, resolve: true },
  },
  plugins: ['@snowpack/plugin-webpack', 'snowpack-plugin-hash'],
  alias: {
    path: 'path-browserify',
  },
};
