# Etch - Service Marketplace Platform

A modern service marketplace platform built with React Native and Expo, connecting service providers with service seekers.

## Features

- Role-based authentication (Service Provider/Service Seeker)
- Service listing and discovery
- Real-time messaging
- AI-powered recommendations
- Booking management
- Profile management
- Search and filtering

## Tech Stack

- React Native with Expo
- TypeScript
- Supabase for backend and authentication
- Socket.IO for real-time messaging
- OpenAI integration for AI features
- React Navigation for routing

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/etch.git
cd etch
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_AI_API_KEY=your_openai_api_key
EXPO_PUBLIC_AI_ENDPOINT=your_ai_endpoint
NEXT_PUBLIC_WS_URL=your_websocket_url
```

4. Start the development server:
```bash
npm run expo:start
```

## Project Structure

```
src/
├── app/            # App entry points and navigation
├── components/     # Reusable UI components
├── config/         # Configuration files
├── lib/           # Core functionality and services
├── screens/       # Screen components
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Testing

- Unit Tests: `npm test`
- Integration Tests: `npm run test:integration`
- E2E Tests: `npm run test:e2e`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Code Style

- Follow the TypeScript best practices
- Use functional components with hooks
- Write meaningful commit messages
- Add proper documentation for new features
- Include unit tests for new functionality

## Compliance

This project complies with Turkish data protection laws (KVKK). Ensure any contributions also maintain compliance with:

- User data privacy
- Data storage regulations
- Consent management
- Data processing transparency

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - your.email@example.com
Project Link: https://github.com/yourusername/etch 