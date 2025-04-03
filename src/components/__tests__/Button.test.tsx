import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('renders correctly with primary variant', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Primary Button" onPress={onPress} variant="primary" />
    );

    const button = getByText('Primary Button');
    expect(button).toBeTruthy();
  });

  it('renders correctly with secondary variant', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Secondary Button" onPress={onPress} variant="secondary" />
    );

    const button = getByText('Secondary Button');
    expect(button).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Press Me" onPress={onPress} variant="primary" />
    );

    const button = getByText('Press Me');
    fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('matches snapshot for primary variant', () => {
    const onPress = jest.fn();
    const { toJSON } = render(
      <Button title="Primary Button" onPress={onPress} variant="primary" />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('matches snapshot for secondary variant', () => {
    const onPress = jest.fn();
    const { toJSON } = render(
      <Button title="Secondary Button" onPress={onPress} variant="secondary" />
    );
    expect(toJSON()).toMatchSnapshot();
  });
}); 