import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useAuth } from '../hooks/useAuth'

export default function ProfileScreen() {
  const { session } = useAuth()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{session?.user?.email}</Text>
        
        <Text style={styles.label}>User ID</Text>
        <Text style={styles.value}>{session?.user?.id}</Text>
        
        <Text style={styles.label}>Last Sign In</Text>
        <Text style={styles.value}>
          {new Date(session?.user?.last_sign_in_at || '').toLocaleDateString()}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    gap: 15,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
  },
}) 