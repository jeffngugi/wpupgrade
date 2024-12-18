/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const yaml = require('js-yaml');
const svgTransformer = require('react-native-svg-transformer');
const upstreamTransformer = require('@react-native/metro-babel-transformer');

module.exports.transform = ({src, filename, options}) => {
  if (filename.endsWith('.yaml')) {
    return upstreamTransformer.transform({
      src: 'module.exports=' + JSON.stringify(yaml.safeLoad(src)),
      filename,
      options,
    });
  }

  if (filename.endsWith('.svg')) {
    return svgTransformer.transform({src, filename, options});
  }

  return upstreamTransformer.transform({src, filename, options});
};
