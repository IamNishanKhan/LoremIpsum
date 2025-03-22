import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { MapPin, Clock, Users, Car, Send, Star, X } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import { useToast } from '../../components/ToastProvider';
import AnimatedPressable from '../../components/AnimatedPressable';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const isHost = currentUser?.id === dummyRide.host.id;

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

    // Update the participants list to mark the user as reviewed
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

  const renderChatMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === dummyRide.host.name ? styles.sentMessage : styles.receivedMessage
    ]}>
      <Text style={styles.messageSender}>{item.sender}</Text>
      <Text style={styles.messageText}>{item.message}</Text>
      <Text style={styles.messageTime}>
        {new Date(item.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );

  const renderStars = (selected = false) => {
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
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.hostInfo}
              onPress={() => handleUserPress(dummyRide.host.id)}
            >
              <Image source={{ uri: dummyRide.host.image }} style={styles.hostImage} />
              <View style={styles.hostDetails}>
                <Text style={styles.hostName}>{dummyRide.host.name}</Text>
                <Text style={styles.hostLabel}>Host</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={styles.detailRow}>
              <Car size={20} color={Colors.light.primary} />
              <Text style={styles.detailText}>{dummyRide.vehicle_type}</Text>
            </View>
            <View style={styles.detailRow}>
              <MapPin size={20} color={Colors.light.primary} />
              <Text style={styles.detailText}>{dummyRide.pickup_name}</Text>
            </View>
            <View style={styles.detailRow}>
              <MapPin size={20} color={Colors.light.error} />
              <Text style={styles.detailText}>{dummyRide.destination_name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Clock size={20} color={Colors.light.primary} />
              <Text style={styles.detailText}>
                {new Date(dummyRide.departure_time).toLocaleString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Users size={20} color={Colors.light.primary} />
              <Text style={styles.detailText}>
                {dummyRide.seats_available} seats available
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Participants</Text>
            <View style={styles.participantsContainer}>
              {participants.map((participant) => (
                <View key={participant.id} style={styles.participantItem}>
                  <TouchableOpacity 
                    style={styles.participantInfo}
                    onPress={() => handleUserPress(participant.id)}
                  >
                    <Image source={{ uri: participant.image }} style={styles.participantImage} />
                    <Text style={styles.participantName}>{participant.name}</Text>
                  </TouchableOpacity>
                  {!participant.reviewed && participant.id !== currentUser?.id && (
                    <TouchableOpacity 
                      style={styles.reviewButton}
                      onPress={() => handleReviewUser(participant)}
                    >
                      <Text style={styles.reviewButtonText}>Review</Text>
                    </TouchableOpacity>
                  )}
                  {participant.reviewed && (
                    <Text style={styles.reviewedText}>Reviewed</Text>
                  )}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            {isHost ? (
              <AnimatedPressable 
                style={[styles.button, styles.deleteButton]}
                onPress={handleDeleteRide}
              >
                <Text style={[styles.buttonText, styles.deleteButtonText]}>
                  Delete Ride
                </Text>
              </AnimatedPressable>
            ) : (
              <>
                <AnimatedPressable 
                  style={[styles.button, styles.joinButton]}
                  onPress={handleJoinRide}
                >
                  <Text style={[styles.buttonText, styles.joinButtonText]}>
                    Join Ride
                  </Text>
                </AnimatedPressable>
                <AnimatedPressable 
                  style={[styles.button, styles.leaveButton]}
                  onPress={handleLeaveRide}
                >
                  <Text style={[styles.buttonText, styles.leaveButtonText]}>
                    Leave Ride
                  </Text>
                </AnimatedPressable>
              </>
            )}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.chatContainer}>
          <FlatList
            data={dummyRide.chat}
            renderItem={renderChatMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.chatList}
            inverted
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={message}
              onChangeText={setMessage}
              placeholderTextColor={Colors.light.subtext}
              multiline
            />
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <Send size={20} color={Colors.light.card} />
            </TouchableOpacity>
          </View>
        </View>
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
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: Colors.light.card,
    padding: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  hostDetails: {
    flex: 1,
  },
  hostName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  hostLabel: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: Colors.light.text,
    marginLeft: 12,
    fontFamily: 'Inter-Regular',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  participantsContainer: {
    gap: 12,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  participantInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  participantName: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  reviewButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reviewButtonText: {
    color: Colors.light.card,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  reviewedText: {
    fontSize: 14,
    color: Colors.light.success,
    fontFamily: 'Inter-Medium',
  },
  buttonContainer: {
    padding: 16,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  joinButton: {
    backgroundColor: Colors.light.primary,
  },
  joinButtonText: {
    color: Colors.light.card,
  },
  leaveButton: {
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.error,
  },
  leaveButtonText: {
    color: Colors.light.error,
  },
  deleteButton: {
    backgroundColor: Colors.light.error,
  },
  deleteButtonText: {
    color: Colors.light.card,
  },
  chatContainer: {
    flex: 1,
  },
  chatList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.light.primary,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  messageSender: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  messageText: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  messageTime: {
    fontSize: 12,
    color: Colors.light.subtext,
    alignSelf: 'flex-end',
    fontFamily: 'Inter-Regular',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.light.card,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
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