import React from 'react';
import TestRenderer from 'react-test-renderer';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DetailsScreen from '../DetailsScreen';

// Mock navigation and route hooks
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

// Define navigation types
type RootStackParamList = {
  Home: undefined;
  Details: { id: string };
  Settings: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

describe('DetailsScreen Integration Tests', () => {
  const mockNavigation = {
    goBack: jest.fn(),
    navigate: jest.fn(),
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default navigation mock
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation as unknown as NavigationProp);
    
    // Setup default route mock with test params
    (useRoute as jest.Mock).mockReturnValue({
      params: {
        id: 'test-id',
      },
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot with valid ID', () => {
      const tree = TestRenderer.create(<DetailsScreen />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot with missing params', () => {
      (useRoute as jest.Mock).mockReturnValue({
        params: undefined,
      });
      const tree = TestRenderer.create(<DetailsScreen />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot with empty params', () => {
      (useRoute as jest.Mock).mockReturnValue({
        params: {},
      });
      const tree = TestRenderer.create(<DetailsScreen />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should match snapshot with different ID value', () => {
      (useRoute as jest.Mock).mockReturnValue({
        params: {
          id: 'different-test-id',
        },
      });
      const tree = TestRenderer.create(<DetailsScreen />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  it('should render details screen with correct title', () => {
    const testRenderer = TestRenderer.create(<DetailsScreen />);
    const testInstance = testRenderer.root;

    // Find the title text
    const titleText = testInstance.findByProps({ testID: 'details-title' });
    expect(titleText.props.children).toBe('Details Screen');
  });

  it('should display the passed ID parameter', () => {
    const testRenderer = TestRenderer.create(<DetailsScreen />);
    const testInstance = testRenderer.root;

    // Find the ID text
    const idText = testInstance.findByProps({ testID: 'details-id' });
    const textContent = Array.isArray(idText.props.children) 
      ? idText.props.children.join('')
      : idText.props.children;
    expect(textContent).toBe('ID: test-id');
  });

  it('should navigate back when back button is pressed', () => {
    const testRenderer = TestRenderer.create(<DetailsScreen />);
    const testInstance = testRenderer.root;

    // Find and press the back button
    const backButton = testInstance.findByProps({ testID: 'back-button' });
    backButton.props.onPress();

    // Verify navigation
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('should navigate to settings when settings button is pressed', () => {
    const testRenderer = TestRenderer.create(<DetailsScreen />);
    const testInstance = testRenderer.root;

    // Find and press the settings button
    const settingsButton = testInstance.findByProps({ testID: 'settings-button' });
    settingsButton.props.onPress();

    // Verify navigation
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Settings');
  });

  describe('Error Handling', () => {
    it('should display error message when params are missing', () => {
      // Mock route with no params
      (useRoute as jest.Mock).mockReturnValue({
        params: undefined,
      });

      const testRenderer = TestRenderer.create(<DetailsScreen />);
      const testInstance = testRenderer.root;

      // Find error message
      const errorMessage = testInstance.findByProps({ testID: 'error-message' });
      expect(errorMessage.props.children).toBe('Error: Missing ID parameter');
    });

    it('should display error message when id is missing', () => {
      // Mock route with empty params
      (useRoute as jest.Mock).mockReturnValue({
        params: {},
      });

      const testRenderer = TestRenderer.create(<DetailsScreen />);
      const testInstance = testRenderer.root;

      // Find error message
      const errorMessage = testInstance.findByProps({ testID: 'error-message' });
      expect(errorMessage.props.children).toBe('Error: Missing ID parameter');
    });

    it('should automatically navigate back after 3 seconds when params are missing', () => {
      jest.useFakeTimers();
      
      // Mock route with no params
      (useRoute as jest.Mock).mockReturnValue({
        params: undefined,
      });

      TestRenderer.create(<DetailsScreen />);

      // Fast-forward 3 seconds
      jest.advanceTimersByTime(3000);

      expect(mockNavigation.goBack).toHaveBeenCalled();
      
      jest.useRealTimers();
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility labels for all interactive elements', () => {
      const testRenderer = TestRenderer.create(<DetailsScreen />);
      const testInstance = testRenderer.root;

      // Check back button accessibility
      const backButton = testInstance.findByProps({ testID: 'back-button' });
      expect(backButton.props.accessibilityLabel).toBe('Go Back');
      expect(backButton.props.accessibilityRole).toBe('button');
      expect(backButton.props.accessible).toBe(true);

      // Check settings button accessibility
      const settingsButton = testInstance.findByProps({ testID: 'settings-button' });
      expect(settingsButton.props.accessibilityLabel).toBe('Go to Settings');
      expect(settingsButton.props.accessibilityRole).toBe('button');
      expect(settingsButton.props.accessible).toBe(true);
    });

    it('should have proper accessibility labels for content elements', () => {
      const testRenderer = TestRenderer.create(<DetailsScreen />);
      const testInstance = testRenderer.root;

      // Check title accessibility
      const titleText = testInstance.findByProps({ testID: 'details-title' });
      expect(titleText.props.accessibilityRole).toBe('header');
      expect(titleText.props.accessible).toBe(true);

      // Check ID text accessibility
      const idText = testInstance.findByProps({ testID: 'details-id' });
      expect(idText.props.accessibilityLabel).toBe('Item ID: test-id');
      expect(idText.props.accessibilityRole).toBe('text');
      expect(idText.props.accessible).toBe(true);
    });

    it('should have proper accessibility for error state', () => {
      // Mock route with no params to trigger error state
      (useRoute as jest.Mock).mockReturnValue({
        params: undefined,
      });

      const testRenderer = TestRenderer.create(<DetailsScreen />);
      const testInstance = testRenderer.root;

      // Check error message accessibility
      const errorMessage = testInstance.findByProps({ testID: 'error-message' });
      expect(errorMessage.props.accessibilityRole).toBe('alert');
      expect(errorMessage.props.accessibilityLabel).toBe('Error: Missing ID parameter');
      expect(errorMessage.props.accessible).toBe(true);

      // Check back button in error state
      const backButton = testInstance.findByProps({ testID: 'back-button' });
      expect(backButton.props.accessibilityLabel).toBe('Go Back');
      expect(backButton.props.accessibilityRole).toBe('button');
      expect(backButton.props.accessible).toBe(true);
    });

    it('should announce screen changes via accessibility', () => {
      const testRenderer = TestRenderer.create(<DetailsScreen />);
      const testInstance = testRenderer.root;

      const container = testInstance.findByProps({ testID: 'details-container' });
      expect(container.props.accessibilityLabel).toBe('Details Screen');
      expect(container.props.accessibilityRole).toBe('none');
      expect(container.props.accessible).toBe(true);
    });
  });
}); 