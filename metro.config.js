// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add additional asset extensions for vector icons
config.resolver.assetExts.push('ttf');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];

// Handle SVG files if you're using them
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

module.exports = config; 