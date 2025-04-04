module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', {
        jsxRuntime: 'automatic'
      }],
    ],
    plugins: [
      '@babel/plugin-transform-typescript',
      'react-native-reanimated/plugin',
      ['@babel/plugin-transform-react-jsx', {
        runtime: 'automatic'
      }],
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@/components': './src/components',
            '@/screens': './src/screens',
            '@/utils': './src/utils',
            '@/': './src',
            '@constants': './src/constants',
          },
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json',
          ],
        },
      ],
    ],
  };
};