import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Car, Bike, Truck, MapPin, Calendar, DollarSign, Users, ToggleLeft as Toggle } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../constants/Colors';
import { useToast } from '../components/ToastProvider';
import AnimatedPressable from '../components/AnimatedPressable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './api_endpoint_url';

const vehicleTypes = [
  { id: 'Private Car', label: 'Private Car', icon: Car, maxSeats: 3 },
  { id: 'Private Bike', label: 'Private Bike', icon: Bike, maxSeats: 1 },
  { id: 'CNG', label: 'CNG', icon: Truck, maxSeats: 2 },
  { id: 'Uber', label: 'Uber', icon: Truck, maxSeats: 3 },
  { id: 'Taxi', label: 'Taxi', icon: Truck, maxSeats: 3 },
  { id: 'Rickshaw', label: 'Rickshaw', icon: Truck, maxSeats: 2 },
];

export default function CreateRideScreen() {
  const [vehicleType, setVehicleType] = useState('');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [totalFare, setTotalFare] = useState('');
  const [isFemaleOnly, setIsFemaleOnly] = useState(false);
  const [userGender, setUserGender] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch(`${BASE_URL}/api/users/profile/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUserGender(data.gender?.toLowerCase());
      } else {
        showToast('Failed to load user profile', 'error');
      }
    } catch (error) {
      showToast('Network error while loading profile', 'error');
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRide = async () => {
    if (!vehicleType || !pickup || !destination || !totalFare) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('access_token');
      const payload = {
        vehicle_type: vehicleType,
        pickup_name: pickup,
        destination_name: destination,
        departure_time: departureDate.toISOString(),
        total_fare: parseFloat(totalFare),
        is_female_only: isFemaleOnly,
      };

      const response = await fetch(`${BASE_URL}/api/rides/create/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Ride created successfully!', 'success');
        router.back();
      } else {
        showToast(data.message || 'Failed to create ride', 'error');
      }
    } catch (error) {
      showToast('Network error while creating ride', 'error');
      console.error('Error creating ride:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFemaleOnlyDisabled = userGender && userGender !== 'female';

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Vehicle Type</Text>
          <View style={styles.vehicleTypesContainer}>
            {vehicleTypes.map((type) => (
              <AnimatedPressable
                key={type.id}
                style={[
                  styles.vehicleTypeButton,
                  vehicleType === type.id && styles.vehicleTypeButtonActive
                ]}
                onPress={() => setVehicleType(type.id)}
              >
                <type.icon 
                  size={24} 
                  color={vehicleType === type.id ? Colors.light.primary : Colors.light.text} 
                />
                <Text style={[
                  styles.vehicleTypeText,
                  vehicleType === type.id && styles.vehicleTypeTextActive
                ]}>
                  {type.label}
                </Text>
                <Text style={styles.seatsText}>
                  {type.maxSeats} seats
                </Text>
              </AnimatedPressable>
            ))}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pickup Location</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} color={Colors.light.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter pickup location"
                value={pickup}
                onChangeText={setPickup}
                placeholderTextColor={Colors.light.subtext}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Destination</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} color={Colors.light.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter destination"
                value={destination}
                onChangeText={setDestination}
                placeholderTextColor={Colors.light.subtext}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Departure Time</Text>
            <TouchableOpacity 
              style={styles.inputContainer}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color={Colors.light.primary} style={styles.inputIcon} />
              <Text style={styles.dateText}>
                {departureDate.toLocaleString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={departureDate}
                mode="datetime"
                display="default"
                minimumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDepartureDate(selectedDate);
                  }
                }}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Total Fare</Text>
            <View style={styles.inputContainer}>
              <DollarSign size={20} color={Colors.light.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter total fare"
                value={totalFare}
                onChangeText={setTotalFare}
                keyboardType="numeric"
                placeholderTextColor={Colors.light.subtext}
              />
            </View>
          </View>

          <View style={[
            styles.toggleContainer,
            isFemaleOnlyDisabled && styles.toggleContainerDisabled
          ]}>
            <Text style={[
              styles.label,
              isFemaleOnlyDisabled && styles.labelDisabled
            ]}>
              Female Only Ride
            </Text>
            <TouchableOpacity 
              style={[
                styles.toggle,
                isFemaleOnly && styles.toggleActive,
                isFemaleOnlyDisabled && styles.toggleDisabled
              ]}
              onPress={() => !isFemaleOnlyDisabled && setIsFemaleOnly(!isFemaleOnly)}
              disabled={isFemaleOnlyDisabled}
            >
              <View style={[
                styles.toggleHandle,
                isFemaleOnly && styles.toggleHandleActive,
                isFemaleOnlyDisabled && styles.toggleHandleDisabled
              ]} />
            </TouchableOpacity>
          </View>
          {isFemaleOnlyDisabled && (
            <Text style={styles.disabledNote}>
              Only female users can create female-only rides
            </Text>
          )}

          <AnimatedPressable 
            style={[styles.createButton, isLoading && styles.createButtonDisabled]}
            onPress={handleCreateRide}
            disabled={isLoading}
          >
            <Text style={styles.createButtonText}>
              {isLoading ? 'Creating...' : 'Create Ride'}
            </Text>
          </AnimatedPressable>
        </View>
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
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  vehicleTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  vehicleTypeButton: {
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  vehicleTypeButtonActive: {
    backgroundColor: Colors.light.primary + '10',
    borderColor: Colors.light.primary,
  },
  vehicleTypeText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  vehicleTypeTextActive: {
    color: Colors.light.primary,
  },
  seatsText: {
    fontSize: 12,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  labelDisabled: {
    color: Colors.light.subtext,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
    paddingVertical: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  toggleContainerDisabled: {
    opacity: 0.5,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.light.border,
    padding: 2,
  },
  toggleActive: {
    backgroundColor: Colors.light.primary,
  },
  toggleDisabled: {
    backgroundColor: Colors.light.border,
  },
  toggleHandle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.light.card,
    transform: [{ translateX: 0 }],
  },
  toggleHandleActive: {
    transform: [{ translateX: 20 }],
  },
  toggleHandleDisabled: {
    backgroundColor: Colors.light.card,
  },
  disabledNote: {
    fontSize: 12,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
    marginTop: -20,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: Colors.light.border,
  },
  createButtonText: {
    color: Colors.light.card,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});