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

export default function RideDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('details');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [ride, setRide] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadUserData();
    fetchRideDetails();
  }, [id]);

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

  const fetchRideDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        showToast('No authentication token found', 'error');
        return;
      }
      const response = await fetch(`${BASE_URL}/api/rides/${id}/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRide(data);
        setParticipants(
          data.members.map((member) => ({
            id: member.id.toString(),
            name: `${member.first_name} ${member.last_name}`,
            image: member.profile_photo
              ? `${BASE_URL}${member.profile_photo}`
              : null,
            reviewed: false,
          }))
        );
      } else {
        showToast('Failed to load ride details', 'error');
      }
    } catch (error) {
      showToast('Network error fetching ride details', 'error');
      console.error('Error fetching ride details:', error);
    }
  };

  const handleJoinRide = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch(`${BASE_URL}/api/rides/join/${id}/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        showToast('Successfully joined the ride!', 'success');
        fetchRideDetails();
      } else {
        showToast('Failed to join ride', 'error');
      }
    } catch (error) {
      showToast('Network error joining ride', 'error');
      console.error('Error joining ride:', error);
    }
  };

  const handleLeaveRide = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch(`${BASE_URL}/api/rides/leave/${id}/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        showToast('You have left the ride', 'info');
        router.back();
      } else {
        showToast('Failed to leave ride', 'error');
      }
    } catch (error) {
      showToast('Network error leaving ride', 'error');
      console.error('Error leaving ride:', error);
    }
  };

  const handleDeleteRide = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch(`${BASE_URL}/api/rides/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        showToast('Ride deleted successfully', 'success');
        router.back();
      } else {
        showToast('Failed to delete ride', 'error');
      }
    } catch (error) {
      showToast('Network error deleting ride', 'error');
      console.error('Error deleting ride:', error);
    }
  };

  const handleReviewUser = (user) => {
    setSelectedUser(user);
    setShowReviewModal(true);
  };

  const handleUserPress = (userId) => {
    router.push(`/user/${userId}`);
  };

  const submitReview = async () => {
    if (rating === 0) {
      showToast('Please select a rating', 'error');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch(`${BASE_URL}/api/reviews/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ride_id: id,
          user_id: selectedUser.id,
          rating,
          comment: reviewText,
        }),
      });

      if (response.ok) {
        setParticipants((prev) =>
          prev.map((p) =>
            p.id === selectedUser.id ? { ...p, reviewed: true } : p
          )
        );
        showToast('Review submitted successfully', 'success');
        setShowReviewModal(false);
        setRating(0);
        setReviewText('');
        setSelectedUser(null);
      } else {
        showToast('Failed to submit review', 'error');
      }
    } catch (error) {
      showToast('Network error submitting review', 'error');
      console.error('Error submitting review:', error);
    }
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

  if (!ride || !currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const isHost = currentUser.id === ride.host.id;
  const isMember = ride.members.some((member) => member.id === currentUser.id);

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
            ride={ride}
            currentUser={currentUser}
            onJoinRide={!isHost && !isMember ? handleJoinRide : null}
            onLeaveRide={!isHost && isMember ? handleLeaveRide : null}
            onDeleteRide={isHost ? handleDeleteRide : null}
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
        <GroupChat />
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
              <View style={styles.starsContainer}>{renderStars()}</View>
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

            <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
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