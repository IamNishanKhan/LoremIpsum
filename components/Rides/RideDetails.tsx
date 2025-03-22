import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { MapPin, Clock, Users, Car } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import AnimatedPressable from '../../components/AnimatedPressable';

const RideDetails = ({ ride, isHost, onUserPress, onJoinRide, onLeaveRide, onDeleteRide }) => {
  return (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <TouchableOpacity style={styles.hostInfo} onPress={() => onUserPress(ride.host.id)}>
          <Image source={{ uri: ride.host.image }} style={styles.hostImage} />
          <View style={styles.hostDetails}>
            <Text style={styles.hostName}>{ride.host.name}</Text>
            <Text style={styles.hostLabel}>Host</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.detailRow}>
          <Car size={20} color={Colors.light.primary} />
          <Text style={styles.detailText}>{ride.vehicle_type}</Text>
        </View>
        <View style={styles.detailRow}>
          <MapPin size={20} color={Colors.light.primary} />
          <Text style={styles.detailText}>{ride.pickup_name}</Text>
        </View>
        <View style={styles.detailRow}>
          <MapPin size={20} color={Colors.light.error} />
          <Text style={styles.detailText}>{ride.destination_name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Clock size={20} color={Colors.light.primary} />
          <Text style={styles.detailText}>
            {new Date(ride.departure_time).toLocaleString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Users size={20} color={Colors.light.primary} />
          <Text style={styles.detailText}>
            {ride.seats_available} seats available
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {isHost ? (
          <AnimatedPressable 
            style={[styles.button, styles.deleteButton]}
            onPress={onDeleteRide}
          >
            <Text style={[styles.buttonText, styles.deleteButtonText]}>
              Delete Ride
            </Text>
          </AnimatedPressable>
        ) : (
          <>
            <AnimatedPressable 
              style={[styles.button, styles.joinButton]}
              onPress={onJoinRide}
            >
              <Text style={[styles.buttonText, styles.joinButtonText]}>
                Join Ride
              </Text>
            </AnimatedPressable>
            <AnimatedPressable 
              style={[styles.button, styles.leaveButton]}
              onPress={onLeaveRide}
            >
              <Text style={[styles.buttonText, styles.leaveButtonText]}>
                Leave Ride
              </Text>
            </AnimatedPressable>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
});

export default RideDetails;