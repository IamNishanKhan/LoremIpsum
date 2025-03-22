import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Star, ChevronLeft } from 'lucide-react-native';
import Colors from '../../../constants/Colors';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Mock reviews data
const mockReviews = [
  {
    id: '1',
    reviewer: {
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    },
    rating: 5,
    comment: 'Great ride companion! Very punctual and friendly.',
    date: '2025-03-15',
  },
  {
    id: '2',
    reviewer: {
      name: 'John Smith',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    },
    rating: 4,
    comment: 'Good experience overall. Safe driver.',
    date: '2025-03-10',
  },
  {
    id: '3',
    reviewer: {
      name: 'Emily Brown',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    },
    rating: 5,
    comment: 'Very comfortable ride and great conversation!',
    date: '2025-03-05',
  },
];

export default function UserReviewsScreen() {
  const { id } = useLocalSearchParams();
  const [reviews, setReviews] = useState(mockReviews);

  useEffect(() => {
    // In a real app, fetch reviews data based on user id
    console.log('Fetching reviews for user:', id);
  }, [id]);

  const renderReview = ({ item, index }) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).duration(400)}
      style={styles.reviewCard}
    >
      <View style={styles.reviewHeader}>
        <View style={styles.reviewerInfo}>
          <Image 
            source={{ uri: item.reviewer.image }} 
            style={styles.reviewerImage}
          />
          <View>
            <Text style={styles.reviewerName}>{item.reviewer.name}</Text>
            <Text style={styles.reviewDate}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              color={i < item.rating ? '#FFD700' : Colors.light.border}
              fill={i < item.rating ? '#FFD700' : 'none'}
            />
          ))}
        </View>
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
        <View style={styles.headerRight} />
      </View>

      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'Inter-SemiBold',
  },
  headerRight: {
    width: 40,
  },
  listContainer: {
    padding: 16,
  },
  reviewCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 2,
    fontFamily: 'Inter-Medium',
  },
  reviewDate: {
    fontSize: 12,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
});