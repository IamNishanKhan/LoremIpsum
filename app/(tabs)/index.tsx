import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, Plus, MapPin } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '../../constants/Colors';
import AnimatedPressable from '../../components/AnimatedPressable';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock data structure for available rides
const availableRides = [
  {
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
    }
  },
  {
    id: '2',
    vehicle_type: 'CNG',
    pickup_name: 'Bashundhara',
    destination_name: 'Gulshan',
    departure_time: '2025-03-22T16:30:00Z',
    total_fare: 200,
    seats_available: 3,
    is_female_only: true,
    host: {
      id: '2',
      name: 'Sarah',
      gender: 'female',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    }
  },
  {
    id: '3',
    vehicle_type: 'Private Car',
    pickup_name: 'NSU Gate',
    destination_name: 'Uttara',
    departure_time: '2025-03-22T17:00:00Z',
    total_fare: 250,
    seats_available: 3,
    is_female_only: false,
    host: {
      id: '3',
      name: 'Karim',
      gender: 'male',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    }
  }
];

export default function HomeScreen() {
  const [rides, setRides] = useState(availableRides);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        setUserProfile(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleCreateRide = () => {
    router.push('/createride');
  };

  const handleFindRide = () => {
    router.push('/rides');
  };

  const handleUserPress = (userId) => {
    router.push(`/user/${userId}`);
  };

  const renderRideCard = ({ item }) => (
    <Animated.View entering={FadeInDown.delay(100).duration(400)}>
      <AnimatedPressable 
        style={styles.rideCard}
        onPress={() => router.push(`/ride/${item.id}`)}
      >
        <View style={styles.rideHeader}>
          <TouchableOpacity 
            style={styles.hostInfo}
            onPress={() => handleUserPress(item.host.id)}
          >
            <Image source={{ uri: item.host.image }} style={styles.hostImage} />
            <View style={styles.hostDetails}>
              <Text style={styles.hostName}>{item.host.name}</Text>
              {item.is_female_only && (
                <View style={styles.femaleOnlyBadge}>
                  <Text style={styles.femaleOnlyText}>Female Only</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.fareText}>৳{item.total_fare}</Text>
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.routePoint}>
            <View style={styles.routeDot} />
            <Text style={styles.locationText}>{item.pickup_name}</Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routePoint}>
            <View style={[styles.routeDot, styles.destinationDot]} />
            <Text style={styles.locationText}>{item.destination_name}</Text>
          </View>
        </View>

        <View style={styles.rideDetails}>
          <Text style={styles.detailText}>
            {new Date(item.departure_time).toLocaleString()}
          </Text>
          <Text style={styles.detailText}>
            {item.seats_available} seats available
          </Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {userProfile?.first_name || 'Rider'}!</Text>
          <Text style={styles.subtitle}>Where would you like to go today?</Text>
        </View>

        <Animated.View 
          style={styles.heroContainer}
          entering={FadeInDown.delay(200).duration(500)}
        >
          <Image
            source={{ uri: 'https://img.freepik.com/free-vector/car-sharing-concept-illustration_114360-2193.jpg?w=740&t=st=1715000000~exp=1715000600~hmac=a7d3c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8' }}
            style={styles.heroImage}
          />
        </Animated.View>

        <Animated.View 
          style={styles.actionsContainer}
          entering={FadeInDown.delay(300).duration(500)}
        >
          <AnimatedPressable 
            style={styles.actionButton}
            onPress={handleFindRide}
          >
            <View style={styles.actionIcon}>
              <Search size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.actionTitle}>Find Mutual Ride</Text>
            <Text style={styles.actionDescription}>
              Search for available rides and join others going your way
            </Text>
          </AnimatedPressable>

          <AnimatedPressable 
            style={styles.actionButton}
            onPress={handleCreateRide}
          >
            <View style={styles.actionIcon}>
              <Plus size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.actionTitle}>Create Ride</Text>
            <Text style={styles.actionDescription}>
              Offer a ride and share your journey with others
            </Text>
          </AnimatedPressable>
        </Animated.View>

        <Animated.View 
          style={styles.availableRidesContainer}
          entering={FadeInDown.delay(400).duration(500)}
        >
          <Text style={styles.sectionTitle}>Available Rides</Text>
          <FlatList
            data={rides}
            renderItem={renderRideCard}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
  },
  heroContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    backgroundColor: Colors.light.card,
  },
  actionsContainer: {
    padding: 20,
  },
  actionButton: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  actionDescription: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
  },
  availableRidesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  rideCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  hostDetails: {
    flex: 1,
  },
  hostName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
    fontFamily: 'Inter-Medium',
  },
  femaleOnlyBadge: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  femaleOnlyText: {
    fontSize: 12,
    color: Colors.light.error,
    fontFamily: 'Inter-Medium',
  },
  fareText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.primary,
    fontFamily: 'Inter-SemiBold',
  },
  routeContainer: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.primary,
    marginRight: 12,
  },
  destinationDot: {
    backgroundColor: Colors.light.error,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: Colors.light.border,
    marginLeft: 4,
    marginVertical: 4,
  },
  locationText: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  rideDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
  },
});