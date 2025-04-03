import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HomeScreen } from '../HomeScreen';

jest.mock('../../utils/dateUtils', () => ({
  formatGreeting: () => 'Good morning!',
}));

describe('HomeScreen', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renders correctly with greeting', () => {
    const { getByText } = render(<HomeScreen />);
    
    expect(getByText('Good morning!')).toBeTruthy();
    expect(getByText('Primary Action')).toBeTruthy();
    expect(getByText('Secondary Action')).toBeTruthy();
  });

  it('handles button presses', () => {
    const { getByText } = render(<HomeScreen />);

    fireEvent.press(getByText('Primary Action'));
    expect(consoleSpy).toHaveBeenCalledWith('Primary button pressed');

    fireEvent.press(getByText('Secondary Action'));
    expect(consoleSpy).toHaveBeenCalledWith('Secondary button pressed');
  });
}); 