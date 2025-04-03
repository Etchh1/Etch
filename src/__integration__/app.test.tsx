import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Text } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('App Integration Tests', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should show home screen with greeting', () => {
    const renderer = TestRenderer.create(<HomeScreen />);
    const instance = renderer.root;

    const greetingText = instance.findByProps({ testID: 'greeting' });
    expect(greetingText.props.children).toBe('Good morning!');
  });

  it('should show primary and secondary buttons', () => {
    const renderer = TestRenderer.create(<HomeScreen />);
    const instance = renderer.root;

    const primaryButton = instance.findByProps({ testID: 'primary-button' });
    const secondaryButton = instance.findByProps({ testID: 'secondary-button' });

    const primaryButtonText = primaryButton.findByType(Text);
    const secondaryButtonText = secondaryButton.findByType(Text);

    expect(primaryButtonText.props.children).toBe('Primary Action');
    expect(secondaryButtonText.props.children).toBe('Secondary Action');
  });

  it('should navigate to details screen when primary button is pressed', () => {
    const renderer = TestRenderer.create(<HomeScreen />);
    const instance = renderer.root;

    const primaryButton = instance.findByProps({ testID: 'primary-button' });
    TestRenderer.act(() => {
      primaryButton.props.onPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('Details');
  });
}); 