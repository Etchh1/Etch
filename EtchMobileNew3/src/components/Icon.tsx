import React from 'react';
import { StyleSheet } from 'react-native';
import {
  AntDesign,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { theme } from '@/styles/theme';

type IconFamily =
  | 'AntDesign'
  | 'Feather'
  | 'FontAwesome'
  | 'Ionicons'
  | 'MaterialCommunityIcons'
  | 'MaterialIcons';

interface IconProps {
  family?: IconFamily;
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

export function Icon({
  family = 'Ionicons',
  name,
  size = 24,
  color = theme.colors.text,
  style,
}: IconProps) {
  const getIconComponent = () => {
    switch (family) {
      case 'AntDesign':
        return <AntDesign name={name as any} size={size} color={color} style={style} />;
      case 'Feather':
        return <Feather name={name as any} size={size} color={color} style={style} />;
      case 'FontAwesome':
        return <FontAwesome name={name as any} size={size} color={color} style={style} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={name as any} size={size} color={color} style={style} />;
      case 'MaterialIcons':
        return <MaterialIcons name={name as any} size={size} color={color} style={style} />;
      case 'Ionicons':
      default:
        return <Ionicons name={name as any} size={size} color={color} style={style} />;
    }
  };

  return getIconComponent();
}

const styles = StyleSheet.create({
  // Add any custom styles here if needed
}); 