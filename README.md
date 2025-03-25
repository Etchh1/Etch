# Etch Mobile App

A React Native mobile application for the Etch service marketplace platform.

## Features

- User Authentication (Sign up, Sign in, Sign out)
- Service Listings
- Service Creation and Management
- Real-time Messaging
- Profile Management
- Service Search and Filtering

## Technologies Used

- React Native
- Expo
- Supabase (Backend and Authentication)
- React Navigation
- TypeScript

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)
- Expo Go app on your mobile device

### Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npx expo start
```

5. Scan the QR code with:
   - iOS: Use the Camera app
   - Android: Use the Expo Go app

## Development

- `npm start` - Start the Expo development server
- `npm run ios` - Start the app in iOS simulator
- `npm run android` - Start the app in Android emulator
- `npm run web` - Start the app in web browser

## Project Structure

```
mobile/
├── src/
│   ├── components/    # Reusable components
│   ├── screens/       # Screen components
│   ├── navigation/    # Navigation configuration
│   ├── hooks/         # Custom hooks
│   ├── lib/          # Utilities and configurations
│   └── types/        # TypeScript type definitions
├── assets/           # Static assets
└── App.tsx          # Root component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 