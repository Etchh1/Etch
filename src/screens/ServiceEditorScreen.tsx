import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, router } from 'expo-router';
import { Screen } from '../components/Screen';
import { Text, TextInput } from '../components/Themed';
import { Button } from '../components/Button';
import { supabase } from '../lib/supabase';
import { authService } from '../lib/auth';
import { aiService } from '../lib/ai';

interface ServiceFormData {
  title: string;
  description: string;
  category: string;
  price: string;
  location: string;
  availability: string;
  images: string[];
}

export default function ServiceEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = authService.getState();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    category: '',
    price: '',
    location: '',
    availability: '',
    images: [],
  });

  useEffect(() => {
    if (id) {
      loadService();
    }
  }, [id]);

  const loadService = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title,
          description: data.description,
          category: data.category,
          price: data.price.toString(),
          location: data.location,
          availability: data.availability.join(', '),
          images: data.images || [],
        });
      }
    } catch (error) {
      console.error('Error loading service:', error);
      Alert.alert('Error', 'Failed to load service details');
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        const file = {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: `service-${Date.now()}.jpg`,
        };

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('services')
          .upload(`${user?.id}/${file.name}`, file, {
            contentType: 'image/jpeg',
          });

        if (error) throw error;

        const imageUrl = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/services/${data.path}`;
        setFormData({
          ...formData,
          images: [...formData.images, imageUrl],
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  const handleGenerateDescription = async () => {
    try {
      setLoading(true);
      const response = await aiService.generateServiceDescription(
        formData.category,
        [formData.title]
      );

      if (response.error) {
        Alert.alert('Error', response.error);
      } else if (response.data) {
        setFormData({
          ...formData,
          description: response.data,
        });
      }
    } catch (error) {
      console.error('Error generating description:', error);
      Alert.alert('Error', 'Failed to generate description');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return false;
    }

    if (!formData.description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return false;
    }

    if (!formData.category.trim()) {
      Alert.alert('Error', 'Please select a category');
      return false;
    }

    if (!formData.price.trim() || isNaN(parseFloat(formData.price))) {
      Alert.alert('Error', 'Please enter a valid price');
      return false;
    }

    if (!formData.location.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const serviceData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        location: formData.location,
        availability: formData.availability.split(',').map((item) => item.trim()),
        images: formData.images,
        provider_id: user?.id,
        updated_at: new Date().toISOString(),
      };

      if (id) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('services').insert({
          ...serviceData,
          created_at: new Date().toISOString(),
        });

        if (error) throw error;
      }

      Alert.alert('Success', 'Service saved successfully');
      router.back();
    } catch (error) {
      console.error('Error saving service:', error);
      Alert.alert('Error', 'Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScrollView style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Service Title"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
        />

        <View style={styles.descriptionContainer}>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Service Description"
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
            multiline
            numberOfLines={6}
          />
          <Button
            title="Generate"
            onPress={handleGenerateDescription}
            disabled={loading || !formData.title}
            style={styles.generateButton}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Category"
          value={formData.category}
          onChangeText={(text) => setFormData({ ...formData, category: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Price"
          value={formData.price}
          onChangeText={(text) => setFormData({ ...formData, price: text })}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Location"
          value={formData.location}
          onChangeText={(text) => setFormData({ ...formData, location: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Availability (comma-separated)"
          value={formData.availability}
          onChangeText={(text) =>
            setFormData({ ...formData, availability: text })
          }
        />

        <View style={styles.imagesContainer}>
          <Text style={styles.imagesTitle}>Service Images</Text>
          <ScrollView horizontal style={styles.imagesList}>
            {formData.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.imagePreview}
              />
            ))}
            <Button
              title="Add Image"
              onPress={handleImagePick}
              style={styles.addImageButton}
            />
          </ScrollView>
        </View>

        <Button
          title={id ? 'Update Service' : 'Create Service'}
          onPress={handleSubmit}
          disabled={loading}
          style={styles.submitButton}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  descriptionContainer: {
    marginBottom: 15,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  generateButton: {
    marginTop: 5,
  },
  imagesContainer: {
    marginBottom: 20,
  },
  imagesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imagesList: {
    flexGrow: 0,
    marginBottom: 10,
  },
  imagePreview: {
    width: 120,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  addImageButton: {
    width: 120,
    height: 80,
    justifyContent: 'center',
  },
  submitButton: {
    marginVertical: 20,
  },
}); 