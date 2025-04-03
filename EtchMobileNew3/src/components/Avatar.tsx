import React, { useState, useCallback } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  NativeSyntheticEvent,
  ImageErrorEventData,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import { colors } from '../config/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface AvatarProps {
  size?: number;
  source?: string | null;
  name?: string;
  onPress?: () => void;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  textStyle?: TextStyle;
  backgroundColor?: string;
  textColor?: string;
  borderWidth?: number;
  borderColor?: string;
  showInitials?: boolean;
  showStatus?: boolean;
  status?: 'online' | 'offline' | 'away';
  statusColor?: string;
  statusSize?: number;
  onError?: (error: NativeSyntheticEvent<ImageErrorEventData>) => void;
  onLoad?: () => void;
  loadingColor?: string;
  placeholderIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  placeholderIconColor?: string;
  placeholderIconSize?: number;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'image';
  testID?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 40,
  source,
  name,
  onPress,
  style,
  imageStyle,
  textStyle,
  backgroundColor = colors.primary,
  textColor = '#FFFFFF',
  borderWidth = 0,
  borderColor = colors.border,
  showInitials = true,
  showStatus = false,
  status = 'offline',
  statusColor,
  statusSize = 12,
  onError,
  onLoad,
  loadingColor = colors.primary,
  placeholderIcon = 'account',
  placeholderIconColor = textColor,
  placeholderIconSize = size * 0.6,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'image',
  testID,
}) => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = useCallback(
    (error: NativeSyntheticEvent<ImageErrorEventData>) => {
      setError(true);
      setIsLoading(false);
      onError?.(error);
    },
    [onError]
  );

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const getInitials = useCallback((name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }, []);

  const getStatusColor = useCallback(() => {
    if (statusColor) return statusColor;
    switch (status) {
      case 'online':
        return colors.success;
      case 'away':
        return colors.warning;
      case 'offline':
      default:
        return colors.textSecondary;
    }
  }, [status, statusColor]);

  const containerStyle = [
    styles.container,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor,
      borderWidth,
      borderColor,
    },
    style,
  ];

  const avatarImageStyle = [
    styles.image,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
    imageStyle,
  ];

  const avatarTextStyle = [
    styles.text,
    {
      color: textColor,
      fontSize: size * 0.4,
      fontWeight: '600',
    },
    textStyle,
  ];

  const statusStyle = [
    styles.status,
    {
      backgroundColor: getStatusColor(),
      width: statusSize,
      height: statusSize,
      borderRadius: statusSize / 2,
      borderWidth: 2,
      borderColor: '#FFFFFF',
      position: 'absolute',
      bottom: 0,
      right: 0,
    },
  ];

  const placeholderIconStyle = [
    styles.placeholderIcon,
    {
      color: placeholderIconColor,
      fontSize: placeholderIconSize,
    },
  ];

  const content = (
    <View style={containerStyle} testID={testID}>
      {source && !error ? (
        <>
          <Image
            source={{ uri: source }}
            style={avatarImageStyle}
            onError={handleError}
            onLoad={handleLoad}
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
            accessibilityRole={accessibilityRole}
          />
          {isLoading && (
            <View style={[styles.loadingContainer, { backgroundColor }]}>
              <ActivityIndicator color={loadingColor} />
            </View>
          )}
        </>
      ) : (
        <View style={[styles.placeholderContainer, { backgroundColor }]}>
          {showInitials && name ? (
            <Text style={avatarTextStyle}>{getInitials(name)}</Text>
          ) : (
            <MaterialCommunityIcons
              name={placeholderIcon}
              style={placeholderIconStyle}
            />
          )}
        </View>
      )}
      {showStatus && <View style={statusStyle} />}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole="button"
        testID={testID}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    textAlign: 'center',
  },
  status: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    textAlign: 'center',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 