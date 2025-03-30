module.exports = ({ config }) => ({
  ...config,
  extra: {
    eas: {
      projectId: "your-project-id" // Replace with your EAS project ID
    }
  },
  updates: {
    url: 'https://u.expo.dev/your-project-id' // Replace with your update URL
  },
  ios: {
    ...config.ios,
    bundleIdentifier: 'com.etch.mobile'
  },
  android: {
    ...config.android,
    package: 'com.etch.mobile'
  },
  plugins: [
    ...config.plugins,
    'expo-updates'
  ],
  hooks: {
    postPublish: [
      {
        file: 'expo-updates/hooks/post-publish.js',
        config: {}
      }
    ]
  }
}); 