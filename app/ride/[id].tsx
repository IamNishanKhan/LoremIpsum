import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Star, X } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import { useToast } from '../../components/ToastProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RideDetails from '../../components/Rides/RideDetails';
import ParticipantsReviews from '../../components/Rides/ParticipantsReviews';
import GroupChat from '../../components/Rides/GroupChat';
import { BASE_URL } from '../api_endpoint_url';

const dummyRide = {
  id: '1',
  vehicle_type: 'Private Car',
  pickup_name: 'NSU Gate',
  destination_name: 'Banani',
  departure_time: '2025-03-22T15:00:00Z',
  total_fare: 150,
  seats_available: 2,
  is_female_only: false,
  host: {
    id: '1',
    name: 'Ayesha',
    gender: 'female',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
  },
  participants: [
    {
      id: '2',
      name: 'Sarah',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
      reviewed: false
    },
    {
      id: '3',
      name: 'John',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
      reviewed: true
    }
  ],
  chat: [
    {
      id: '1',
      sender: 'Ayesha',
      message: 'Leaving soon',
      timestamp: '2025-03-22T14:45:00Z'
    },
    {
      id: '2',
      sender: 'Sarah',
      message: 'I will be there in 5 minutes',
      timestamp: '2025-03-22T14:46:00Z'
    }
  ]
};

export default function RideDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('details');
  const [message, setMessage] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [participants, setParticipants] = useState(dummyRide.participants);
  const [currentUser, setCurrentUser] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleJoinRide = () => {
    showToast('Successfully joined the ride!', 'success');
  };

  const handleLeaveRide = () => {
    showToast('You have left the ride', 'info');
    router.back();
  };

  const handleDeleteRide = () => {
    showToast('Ride deleted successfully', 'success');
    router.back();
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setMessage('');
    showToast('Message sent', 'success');
  };

  const handleReviewUser = (user) => {
    setSelectedUser(user);
    setShowReviewModal(true);
  };

  const handleUserPress = (userId) => {
    router.push(`/user/${userId}`);
  };

  const submitReview = () => {
    if (rating === 0) {
      showToast('Please select a rating', 'error');
      return;
    }

    setParticipants(prev => 
      prev.map(p => 
        p.id === selectedUser.id 
          ? { ...p, reviewed: true }
          : p
      )
    );

    showToast('Review submitted successfully', 'success');
    setShowReviewModal(false);
    setRating(0);
    setReviewText('');
    setSelectedUser(null);
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => setRating(index + 1)}
        style={styles.starContainer}
      >
        <Star
          size={30}
          color={index < rating ? '#FFD700' : Colors.light.border}
          fill={index < rating ? '#FFD700' : 'none'}
        />
      </TouchableOpacity>
    ));
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'details' && styles.activeTab]}
          onPress={() => setActiveTab('details')}
        >
          <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>
            Ride Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
          onPress={() => setActiveTab('chat')}
        >
          <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>
            Group Chat
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'details' ? (
        <>
          <RideDetails 
            ride={dummyRide}
            currentUser={currentUser}
            onJoinRide={handleJoinRide}
            onLeaveRide={handleLeaveRide}
            onDeleteRide={handleDeleteRide}
            onUserPress={handleUserPress}
          />
          <ParticipantsReviews 
            participants={participants}
            currentUser={currentUser}
            onUserPress={handleUserPress}
            onReviewUser={handleReviewUser}
          />
        </>
      ) : (
        <GroupChat 
          chat={dummyRide.chat}
          message={message}
          setMessage={setMessage}
          onSendMessage={handleSendMessage}
        />
      )}

      <Modal
        visible={showReviewModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowReviewModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Review {selectedUser?.name}</Text>
              <TouchableOpacity 
                onPress={() => setShowReviewModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.ratingContainer}>
              <Text style={styles.ratingLabel}>Rate your experience</Text>
              <View style={styles.starsContainer}>
                {renderStars()}
              </View>
            </View>

            <View style={styles.reviewInputContainer}>
              <TextInput
                style={styles.reviewInput}
                placeholder="Write your review (optional)"
                value={reviewText}
                onChangeText={setReviewText}
                multiline
                numberOfLines={4}
                placeholderTextColor={Colors.light.subtext}
              />
            </View>

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={submitReview}
            >
              <Text style={styles.submitButtonText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.light.primary,
  },
  tabText: {
    fontSize: 16,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Medium',
  },
  activeTabText: {
    color: Colors.light.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'Inter-SemiBold',
  },
  closeButton: {
    padding: 4,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 12,
    fontFamily: 'Inter-Medium',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  starContainer: {
    padding: 4,
  },
  reviewInputContainer: {
    marginBottom: 20,
  },
  reviewInput: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: Colors.light.card,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});