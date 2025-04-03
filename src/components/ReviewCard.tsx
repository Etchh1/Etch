import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from './Themed';
import { Review } from '../types/reviews';
import { Card } from './Card';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {review.user.avatarUrl && (
            <Image
              source={{ uri: review.user.avatarUrl }}
              style={styles.avatar}
              accessible={true}
              accessibilityLabel={`${review.user.fullName}'s avatar`}
            />
          )}
          <View style={styles.userDetails}>
            <Text style={styles.userName} accessible={true}>
              {review.user.fullName}
            </Text>
            <Text style={styles.date} accessible={true}>
              {new Date(review.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating} accessible={true}>
            {'⭐️'.repeat(review.rating)}
            {'☆'.repeat(5 - review.rating)}
          </Text>
        </View>
      </View>

      <Text style={styles.comment} accessible={true}>
        {review.comment}
      </Text>

      {review.response && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseLabel} accessible={true}>
            Provider&apos;s Response:
          </Text>
          <Text style={styles.responseText} accessible={true}>
            {review.response}
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666666',
  },
  ratingContainer: {
    marginLeft: 8,
  },
  rating: {
    fontSize: 16,
  },
  comment: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  responseContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  responseLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#666666',
  },
  responseText: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 