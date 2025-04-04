module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@/components': './components',
          '@/screens': './screens',
          '@/utils': './utils',
        },
      },
    ],
  ],
};