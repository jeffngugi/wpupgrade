const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {getSentryExpoConfig} = require('@sentry/react-native/metro');

const defaultConfig = getDefaultConfig(__dirname);
const {assetExts, sourceExts} = defaultConfig.resolver;
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    babelTransformerPath: require.resolve('./transform-module'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg' && ext !== 'yaml'),
    sourceExts: [
      ...sourceExts,
      'ts',
      'tsx',
      'svg',
      'yaml',
      'js',
      'jsx',
      'cjs',
      'json',
    ],
  },
};

module.exports = mergeConfig(getSentryExpoConfig(__dirname), config);
