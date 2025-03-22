import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, Filter, Car, Bike, Truck } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '../../constants/Colors';
import { useToast } from '../../components/ToastProvider';
import AnimatedPressable from '../../components/AnimatedPressable';

const dummyRides = [
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
      name: 'Sarah',
      gender: 'female',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    }
  }
];

const vehicleTypes = [
  { id: 'all', label: 'All', icon: Car },
  { id: 'car', label: 'Car', icon: Car },
  { id: 'bike', label: 'Bike', icon: Bike },
  { id: 'cng', label: 'CNG', icon: Truck }
];

export default function RidesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState('all');
  const [showFemaleOnly, setShowFemaleOnly] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const { showToast } = useToast();

  const handleJoinWithCode = () => {
    if (!joinCode.trim()) {
      showToast('Please enter a join code', 'error');
      return;
    }
    showToast('Joining ride...', 'info');
    setJoinCode('');
  };

  const handleRidePress = (rideId: string) => {
    router.push(`/ride/${rideId}`);
  };

  const renderRideCard = ({ item }) => (
    <Animated.View entering={FadeInDown.delay(100).duration(400)}>
      <AnimatedPressable 
        style={styles.rideCard}
        onPress={() => handleRidePress(item.id)}
      >
        <View style={styles.rideHeader}>
          <View style={styles.rideInfo}>
            <Text style={styles.vehicleType}>{item.vehicle_type}</Text>
            {item.is_female_only && (
              <View style={styles.femaleOnlyBadge}>
                <Text style={styles.femaleOnlyText}>Female Only</Text>
              </View>
            )}
          </View>
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

        <View style={styles.hostInfo}>
          <Text style={styles.hostedBy}>Hosted by {item.host.name}</Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Rides</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.light.subtext} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search rides..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.light.subtext}
          />
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {vehicleTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.filterButton,
                selectedVehicleType === type.id && styles.filterButtonActive
              ]}
              onPress={() => setSelectedVehicleType(type.id)}
            >
              <type.icon 
                size={16} 
                color={selectedVehicleType === type.id ? Colors.light.card : Colors.light.text} 
              />
              <Text style={[
                styles.filterButtonText,
                selectedVehicleType === type.id && styles.filterButtonTextActive
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[styles.femaleOnlyButton, showFemaleOnly && styles.femaleOnlyButtonActive]}
          onPress={() => setShowFemaleOnly(!showFemaleOnly)}
        >
          <Text style={[
            styles.femaleOnlyButtonText,
            showFemaleOnly && styles.femaleOnlyButtonTextActive
          ]}>
            Female Only
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.joinCodeContainer}>
        <TextInput
          style={styles.joinCodeInput}
          placeholder="Enter join code"
          value={joinCode}
          onChangeText={setJoinCode}
          placeholderTextColor={Colors.light.subtext}
        />
        <TouchableOpacity 
          style={styles.joinCodeButton}
          onPress={handleJoinWithCode}
        >
          <Text style={styles.joinCodeButtonText}>Join</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={dummyRides}
        renderItem={renderRideCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.ridesList}
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
    padding: 16,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    fontFamily: 'Inter-Bold',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: Colors.light.card,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  filtersScroll: {
    paddingRight: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  filterButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  filterButtonTextActive: {
    color: Colors.light.card,
  },
  femaleOnlyButton: {
    backgroundColor: Colors.light.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  femaleOnlyButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  femaleOnlyButtonText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  femaleOnlyButtonTextActive: {
    color: Colors.light.card,
  },
  joinCodeContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  joinCodeInput: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  joinCodeButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinCodeButtonText: {
    color: Colors.light.card,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  ridesList: {
    padding: 16,
  },
  rideCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
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
  rideInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleType: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginRight: 8,
    fontFamily: 'Inter-SemiBold',
  },
  femaleOnlyBadge: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
    marginBottom: 16,
  },
  detailText: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
  },
  hostInfo: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 16,
  },
  hostedBy: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
});