const postcss = require('rollup-plugin-postcss');
const cssnano = require('cssnano');

module.exports = {
  rollup(config) {
    config.plugins.push(
      postcss({
        plugins: [
            cssnano({
                preset: 'default',
            }),
        ],  
        inject: true,
        modules: true,
        extract: false,
      })
    );
    return config;
  },
};