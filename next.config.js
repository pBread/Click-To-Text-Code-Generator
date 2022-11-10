const withPlugins = require("next-compose-plugins");
const withLess = require("next-with-less");

module.exports = withPlugins(
  [
    withLess({
      lessLoaderOptions: {
        javascriptEnabled: true,
      },
    }),
  ],
  {
    reactStrictMode: true,
  }
);
