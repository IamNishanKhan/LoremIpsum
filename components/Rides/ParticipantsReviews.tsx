import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';

const ParticipantsReviews = ({ participants, currentUserId, onUserPress, onReviewUser }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Participants</Text>
      <View style={styles.participantsContainer}>
        {participants.map((participant) => (
          <View key={participant.id} style={styles.participantItem}>
            <TouchableOpacity 
              style={styles.participantInfo}
              onPress={() => onUserPress(participant.id)}
            >
              <Image 
                source={{ uri: participant.profile_photo || 'https://via.placeholder.com/40' }} 
                style={styles.participantImage} 
              />
              <Text style={styles.participantName}>
                {participant.name || `${participant.first_name} ${participant.last_name}`}
              </Text>
            </TouchableOpacity>
            {!participant.reviewed && participant.id !== currentUserId && (
              <TouchableOpacity 
                style={styles.reviewButton}
                onPress={() => onReviewUser(participant)}
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
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: Colors.light.card,
    padding: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
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
});

export default ParticipantsReviews;