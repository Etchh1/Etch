// Mock react-native
jest.mock('react-native', () => {
  return {
    Platform: {
      OS: 'ios',
      select: jest.fn((obj) => obj.ios),
    },
    NativeModules: {
      NativeDeviceInfo: {
        getConstants: () => ({
          Dimensions: {
            window: {
              width: 375,
              height: 812,
              scale: 2,
              fontScale: 1,
            },
            screen: {
              width: 375,
              height: 812,
              scale: 2,
              fontScale: 1,
            },
          },
        }),
      },
      PlatformConstants: {
        getConstants: () => ({
          isTesting: true,
        }),
      },
      StatusBarManager: {
        getHeight: jest.fn(),
        setStyle: jest.fn(),
        setHidden: jest.fn(),
      },
    },
    BackHandler: {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    Dimensions: {
      get: jest.fn().mockReturnValue({
        width: 375,
        height: 812,
        scale: 2,
        fontScale: 1,
      }),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    StyleSheet: {
      create: (styles) => styles,
      flatten: jest.fn((style) => style),
    },
    View: 'View',
    Text: 'Text',
    TouchableOpacity: 'TouchableOpacity',
    Image: 'Image',
    ActivityIndicator: 'ActivityIndicator',
    ScrollView: 'ScrollView',
    FlatList: 'FlatList',
    TextInput: 'TextInput',
    Pressable: 'Pressable',
    Modal: 'Modal',
    Alert: {
      alert: jest.fn(),
    },
    Animated: {
      View: 'Animated.View',
      Text: 'Animated.Text',
      Image: 'Animated.Image',
      createAnimatedComponent: jest.fn((component) => component),
      timing: jest.fn(),
      spring: jest.fn(),
      Value: jest.fn(),
    },
  };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  useAnimatedStyle: () => ({}),
  withTiming: (toValue) => toValue,
  withSpring: (toValue) => toValue,
  withSequence: (...animations) => animations[animations.length - 1],
  withDelay: (_, animation) => animation,
  useSharedValue: (value) => ({ value }),
  useAnimatedGestureHandler: () => ({}),
  createAnimatedComponent: (component) => component,
  View: ({ children }) => children,
  Text: ({ children }) => children,
  Image: ({ children }) => children,
  ScrollView: ({ children }) => children,
  default: {
    call: () => {},
    createAnimatedComponent: (component) => component,
  },
}));

// Mock react-navigation
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  SafeAreaView: ({ children }) => children,
}));

// Mock @react-navigation/native-stack
jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: jest.fn().mockReturnValue({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({
  State: {
    UNDETERMINED: 0,
    FAILED: 1,
    BEGAN: 2,
    CANCELLED: 3,
    ACTIVE: 4,
    END: 5,
  },
}));

// Mock Colors module
jest.mock('./src/constants/Colors', () => ({
  default: {
    light: {
      text: '#000',
      background: '#fff',
      tint: '#007AFF',
      tabIconDefault: '#ccc',
      tabIconSelected: '#007AFF',
    },
    dark: {
      text: '#fff',
      background: '#000',
      tint: '#fff',
      tabIconDefault: '#ccc',
      tabIconSelected: '#fff',
    },
  },
}));

// Mock TurboModuleRegistry
jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => ({
  get: jest.fn((name) => {
    if (name === 'PlatformConstants') {
      return {
        getConstants: () => ({
          isTesting: true,
          reactNativeVersion: {
            major: 0,
            minor: 73,
            patch: 2,
          },
        }),
      };
    }
    return null;
  }),
  getEnforcing: jest.fn((name) => {
    if (name === 'PlatformConstants') {
      return {
        getConstants: () => ({
          isTesting: true,
          reactNativeVersion: {
            major: 0,
            minor: 73,
            patch: 2,
          },
        }),
      };
    }
    return null;
  }),
}));

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
