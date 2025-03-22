import React, { useState } from 'react';
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

const vehicleTypes = [
  { id: 'car', label: 'Private Car', icon: Car, maxSeats: 3 },
  { id: 'bike', label: 'Private Bike', icon: Bike, maxSeats: 1 },
  { id: 'cng', label: 'CNG/Uber/Taxi', icon: Truck, maxSeats: 3 },
];

export default function CreateRideScreen() {
  const [vehicleType, setVehicleType] = useState('');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [totalFare, setTotalFare] = useState('');
  const [isFemaleOnly, setIsFemaleOnly] = useState(false);
  const { showToast } = useToast();

  const handleCreateRide = () => {
    if (!vehicleType || !pickup || !destination || !totalFare) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    showToast('Ride created successfully!', 'success');
    router.back();
  };

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

          <View style={styles.toggleContainer}>
            <Text style={styles.label}>Female Only Ride</Text>
            <TouchableOpacity 
              style={[styles.toggle, isFemaleOnly && styles.toggleActive]}
              onPress={() => setIsFemaleOnly(!isFemaleOnly)}
            >
              <View style={[styles.toggleHandle, isFemaleOnly && styles.toggleHandleActive]} />
            </TouchableOpacity>
          </View>

          <AnimatedPressable 
            style={styles.createButton}
            onPress={handleCreateRide}
          >
            <Text style={styles.createButtonText}>Create Ride</Text>
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
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  vehicleTypeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    marginHorizontal: 4,
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
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
  createButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  createButtonText: {
    color: Colors.light.card,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});