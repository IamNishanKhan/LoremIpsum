import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, Clock, Users, Car } from 'lucide-react-native';

interface Driver {
  name: string;
  rating: number;
  image: string;
}

interface RideCardProps {
  id: string;
  driver: Driver;
  from: string;
  to: string;
  time: string;
  date: string;
  price: string;
  seats: {
    total: number;
    available: number;
  };
  vehicle: string;
  onPress?: () => void;
}

export default function RideCard({
  driver,
  from,
  to,
  time,
  date,
  price,
  seats,
  vehicle,
  onPress,
}: RideCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.driverInfo}>
          <Image source={{ uri: driver.image }} style={styles.driverImage} />
          <View>
            <Text style={styles.driverName}>{driver.name}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{driver.rating}</Text>
              <Text style={styles.ratingStars}>★★★★★</Text>
            </View>
          </View>
        </View>
        <Text style={styles.priceText}>{price}</Text>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routePoints}>
          <View style={styles.routePointDot} />
          <View style={styles.routeLine} />
          <View style={[styles.routePointDot, styles.routePointDotDestination]} />
        </View>
        <View style={styles.routeDetails}>
          <View style={styles.routePoint}>
            <Text style={styles.routePointText}>{from}</Text>
          </View>
          <View style={styles.routePoint}>
            <Text style={styles.routePointText}>{to}</Text>
          </View>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Clock size={16} color="#8E8E93" />
          <Text style={styles.detailText}>{time}, {date}</Text>
        </View>
        <View style={styles.detailItem}>
          <Users size={16} color="#8E8E93" />
          <Text style={styles.detailText}>{seats.available} seats available</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.vehicleInfo}>
          <Car size={16} color="#8E8E93" />
          <Text style={styles.vehicleText}>{vehicle}</Text>
        </View>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join Ride</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 5,
  },
  ratingStars: {
    fontSize: 12,
    color: '#FFD700',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6C63FF',
  },
  routeContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  routePoints: {
    width: 20,
    alignItems: 'center',
    marginRight: 10,
  },
  routePointDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6C63FF',
  },
  routePointDotDestination: {
    backgroundColor: '#FF3B30',
  },
  routeLine: {
    width: 2,
    height: 30,
    backgroundColor: '#E0E0E0',
    marginVertical: 5,
  },
  routeDetails: {
    flex: 1,
  },
  routePoint: {
    height: 25,
    justifyContent: 'center',
    marginBottom: 5,
  },
  routePointText: {
    fontSize: 15,
    color: '#333333',
  },
  details: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 15,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 5,
  },
  joinButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});