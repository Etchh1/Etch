import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Screen } from '../components/Screen';
import { Text, TextInput } from '../components/Themed';
import { Button } from '../components/Button';
import { authService } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { colors } from '../config/colors';

interface ProfileFormData {
  fullName: string;
  phone: string;
  location: string;
  bio: string;
  // Provider-specific fields
  expertise?: string[];
  hourlyRate?: string;
  availability?: string;
  // Seeker-specific fields
  preferences?: string[];
  preferredLocation?: string;
}

export default function ProfileScreen() {
  const { user, role } = authService.getState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: '',
    phone: '',
    location: '',
    bio: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          fullName: data.full_name || '',
          phone: data.phone || '',
          location: data.location || '',
          bio: data.bio || '',
          expertise: data.expertise || [],
          hourlyRate: data.hourly_rate?.toString() || '',
          availability: data.availability || '',
          preferences: data.preferences || [],
          preferredLocation: data.preferred_location || '',
        });
        setAvatar(data.avatar_url);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile');
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const file = {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'profile-image.jpg',
        };

        const { data, error } = await supabase.storage
          .from('avatars')
          .upload(`${user?.id}/profile.jpg`, file, {
            contentType: 'image/jpeg',
            upsert: true,
          });

        if (error) throw error;

        const avatarUrl = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${data.path}`;
        setAvatar(avatarUrl);
        await updateProfile({ avatar_url: avatarUrl });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setError('Failed to update profile picture');
    }
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }

    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }

    if (role === 'SERVICE_PROVIDER') {
      if (!formData.expertise?.length) {
        setError('Please enter your areas of expertise');
        return false;
      }

      if (!formData.hourlyRate) {
        setError('Please enter your hourly rate');
        return false;
      }
    }

    return true;
  };

  const updateProfile = async (additionalData = {}) => {
    try {
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.fullName,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          ...(role === 'SERVICE_PROVIDER' && {
            expertise: formData.expertise,
            hourly_rate: parseFloat(formData.hourlyRate || '0'),
            availability: formData.availability,
          }),
          ...(role === 'SERVICE_SEEKER' && {
            preferences: formData.preferences,
            preferred_location: formData.preferredLocation,
          }),
          updated_at: new Date().toISOString(),
          ...additionalData,
        });

      if (error) throw error;
      Alert.alert('Success', 'Profile updated successfully');
      setError(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await updateProfile();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen
      title="Profile"
      loading={loading}
      error={error}
      onRetry={() => {
        setError(null);
        loadProfile();
      }}
      scrollable
    >
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholderAvatar]}>
              <Text style={styles.placeholderText}>
                {formData.fullName.charAt(0) || '?'}
              </Text>
            </View>
          )}
          <Button
            title="Change Picture"
            onPress={handleImagePick}
            style={styles.imageButton}
          />
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Location"
            value={formData.location}
            onChangeText={(text) => setFormData({ ...formData, location: text })}
          />

          <TextInput
            style={[styles.input, styles.bioInput]}
            placeholder="Bio"
            value={formData.bio}
            onChangeText={(text) => setFormData({ ...formData, bio: text })}
            multiline
            numberOfLines={4}
          />

          {role === 'SERVICE_PROVIDER' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Hourly Rate"
                value={formData.hourlyRate}
                onChangeText={(text) => setFormData({ ...formData, hourlyRate: text })}
                keyboardType="numeric"
              />

              <TextInput
                style={styles.input}
                placeholder="Availability"
                value={formData.availability}
                onChangeText={(text) => setFormData({ ...formData, availability: text })}
              />
            </>
          )}

          {role === 'SERVICE_SEEKER' && (
            <TextInput
              style={styles.input}
              placeholder="Preferred Location"
              value={formData.preferredLocation}
              onChangeText={(text) => setFormData({ ...formData, preferredLocation: text })}
            />
          )}

          <Button
            title="Save Profile"
            onPress={handleSubmit}
            style={styles.submitButton}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  placeholderAvatar: {
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
    color: colors.text,
  },
  imageButton: {
    marginTop: 8,
  },
  formContainer: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 24,
  },
}); 