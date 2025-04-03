# Etch Mobile App

A modern mobile application built with Expo and React Native.

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac users) or Android Studio (for Android development)

## Getting Started

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Start the development server:
```bash
npm start
# or
yarn start
```

3. Run on your preferred platform:
- Press `i` to open in iOS simulator
- Press `a` to open in Android emulator
- Scan the QR code with Expo Go app on your physical device

## Project Structure

```
src/
├── app/           # Expo Router pages
├── components/    # Reusable components
├── constants/     # App constants and configuration
├── hooks/         # Custom React hooks
├── services/      # API and external service integrations
├── store/         # State management (Zustand)
├── styles/        # Global styles and theme
└── types/         # TypeScript type definitions
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start the app on Android
- `npm run ios` - Start the app on iOS
- `npm run web` - Start the app in web browser
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Building for Production

1. Configure your environment variables in `.env` file
2. Build for your target platform:
```bash
# For iOS
eas build --platform ios

# For Android
eas build --platform android
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is proprietary and confidential. 