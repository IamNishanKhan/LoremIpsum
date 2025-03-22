import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  Dimensions,
  Image,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  ChevronDown, 
  Car as CarIcon, 
  Truck, 
  Bike,
  Bell,
  Chrome as HomeIcon,
  Car,
  TriangleAlert as AlertTriangle,
  Clock as ClockIcon,
  User,
  Star,
  Users,
  DollarSign,
  ChevronRight
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '../../constants/Colors';
import { useToast } from '../../components/ToastProvider';
import AnimatedPressable from '../../components/AnimatedPressable';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

// Sample data for available rides
const availableRides = [
  {
    id: '1',
    driver: {
      name: 'Michael Chen',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    from: 'Downtown',
    to: 'University Campus',
    time: '10:30 AM',
    date: 'Today',
    price: '$8.50',
    seats: {
      total: 4,
      available: 2
    },
    vehicle: 'Toyota Camry (White)',
    distance: '3.2 miles away'
  },
  {
    id: '2',
    driver: {
      name: 'Sarah Johnson',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    from: 'Shopping Mall',
    to: 'Central Park',
    time: '1:15 PM',
    date: 'Today',
    price: '$12.00',
    seats: {
      total: 4,
      available: 3
    },
    vehicle: 'Honda Civic (Blue)',
    distance: '1.5 miles away'
  },
  {
    id: '3',
    driver: {
      name: 'David Wilson',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    from: 'Airport Terminal',
    to: 'Downtown Hotel',
    time: '3:45 PM',
    date: 'Tomorrow',
    price: '$25.00',
    seats: {
      total: 3,
      available: 3
    },
    vehicle: 'Tesla Model 3 (Black)',
    distance: '5.7 miles away'
  },
  {
    id: '4',
    driver: {
      name: 'Emily Rodriguez',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    from: 'Tech Park',
    to: 'Residential Area',
    time: '6:00 PM',
    date: 'Today',
    price: '$15.50',
    seats: {
      total: 4,
      available: 1
    },
    vehicle: 'Hyundai Sonata (Silver)',
    distance: '2.3 miles away'
  }
];

// Sample data for my rides
const myRides = [
  {
    id: '1',
    type: 'driver',
    from: 'Home',
    to: 'Office',
    time: '8:30 AM',
    date: 'Tomorrow',
    price: '$18.00',
    seats: {
      total: 4,
      available: 3
    },
    passengers: [
      {
        name: 'John Smith',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
      }
    ],
    status: 'upcoming'
  },
  {
    id: '2',
    type: 'passenger',
    driver: {
      name: 'Lisa Wang',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    },
    from: 'Gym',
    to: 'Shopping Mall',
    time: '5:15 PM',
    date: 'Today',
    price: '$9.50',
    status: 'upcoming'
  },
  {
    id: '3',
    type: 'driver',
    from: 'University',
    to: 'Downtown',
    time: '4:30 PM',
    date: 'May 25, 2025',
    price: '$14.00',
    seats: {
      total: 4,
      available: 0
    },
    passengers: [
      {
        name: 'Emma Davis',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
      },
      {
        name: 'Alex Johnson',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
      },
      {
        name: 'Maria Garcia',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
      },
      {
        name: 'James Wilson',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
      }
    ],
    status: 'upcoming'
  }
];

export default function RidesScreen() {
  const [activeTab, setActiveTab] = useState('create');
  const [startingPoint, setStartingPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [vehicleType, setVehicleType] = useState('car');
  const [gender, setGender] = useState('any');
  const [riders, setRiders] = useState('1 Rider');
  const [notes, setNotes] = useState('');
  const { showToast } = useToast();

  const handleCreateRide = () => {
    if (!startingPoint || !destination || !date || !time) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    showToast('Ride created successfully!', 'success');
    // In a real app, this would save the ride to a database
    setActiveTab('my');
  };

  const handleSaveDraft = () => {
    showToast('Draft saved successfully!', 'success');
    // In a real app, this would save the ride as a draft
  };

  const renderAvailableRideItem = ({ item }) => (
    <Animated.View entering={FadeInDown.delay(100).duration(400)}>
      <AnimatedPressable style={styles.rideCard}>
        <View style={styles.rideCardHeader}>
          <View style={styles.driverInfo}>
            <Image source={{ uri: item.driver.image }} style={styles.driverImage} />
            <View>
              <Text style={styles.driverName}>{item.driver.name}</Text>
              <View style={styles.ratingContainer}>
                <Star size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{item.driver.rating}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.routePoints}>
            <View style={styles.routePointDot} />
            <View style={styles.routeLine} />
            <View style={[styles.routePointDot, styles.routePointDotDestination]} />
          </View>
          <View style={styles.routeDetails}>
            <View style={styles.routePoint}>
              <Text style={styles.routePointText}>{item.from}</Text>
            </View>
            <View style={styles.routePoint}>
              <Text style={styles.routePointText}>{item.to}</Text>
            </View>
          </View>
        </View>

        <View style={styles.rideDetails}>
          <View style={styles.rideDetailItem}>
            <Clock size={16} color={Colors.light.subtext} />
            <Text style={styles.rideDetailText}>{item.time}, {item.date}</Text>
          </View>
          <View style={styles.rideDetailItem}>
            <Users size={16} color={Colors.light.subtext} />
            <Text style={styles.rideDetailText}>{item.seats.available} seats available</Text>
          </View>
        </View>

        <View style={styles.rideCardFooter}>
          <View style={styles.vehicleInfo}>
            <Car size={16} color={Colors.light.subtext} />
            <Text style={styles.vehicleText}>{item.vehicle}</Text>
          </View>
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Join Ride</Text>
          </TouchableOpacity>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );

  const renderMyRideItem = ({ item }) => (
    <Animated.View entering={FadeInDown.delay(100).duration(400)}>
      <AnimatedPressable style={styles.rideCard}>
        <View style={styles.rideCardHeader}>
          <View style={styles.rideTypeContainer}>
            <Text style={styles.rideTypeText}>
              {item.type === 'driver' ? 'You\'re driving' : 'You\'re riding'}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: '#E1F5E1' }]}>
              <Text style={[styles.statusText, { color: Colors.light.success }]}>
                Upcoming
              </Text>
            </View>
          </View>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.routePoints}>
            <View style={styles.routePointDot} />
            <View style={styles.routeLine} />
            <View style={[styles.routePointDot, styles.routePointDotDestination]} />
          </View>
          <View style={styles.routeDetails}>
            <View style={styles.routePoint}>
              <Text style={styles.routePointText}>{item.from}</Text>
            </View>
            <View style={styles.routePoint}>
              <Text style={styles.routePointText}>{item.to}</Text>
            </View>
          </View>
        </View>

        <View style={styles.rideDetails}>
          <View style={styles.rideDetailItem}>
            <Clock size={16} color={Colors.light.subtext} />
            <Text style={styles.rideDetailText}>{item.time}, {item.date}</Text>
          </View>
        </View>

        {item.type === 'driver' ? (
          <View style={styles.passengersContainer}>
            <Text style={styles.passengersTitle}>
              Passengers ({item.passengers.length}/{item.seats.total})
            </Text>
            <View style={styles.passengersList}>
              {item.passengers.map((passenger, index) => (
                <Image 
                  key={index}
                  source={{ uri: passenger.image }} 
                  style={[
                    styles.passengerImage,
                    { marginLeft: index > 0 ? -10 : 0 }
                  ]} 
                />
              ))}
              {item.seats.available > 0 && (
                <View style={styles.availableSeatsContainer}>
                  <Text style={styles.availableSeatsText}>+{item.seats.available}</Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.driverInfoLarge}>
            <Image source={{ uri: item.driver.image }} style={styles.driverImageLarge} />
            <View>
              <Text style={styles.driverNameLarge}>{item.driver.name}</Text>
              <View style={styles.ratingContainer}>
                <Star size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{item.driver.rating}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.rideCardFooter}>
          <TouchableOpacity style={styles.detailsButton}>
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
          {item.type === 'driver' && (
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel Ride</Text>
            </TouchableOpacity>
          )}
        </View>
      </AnimatedPressable>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rides</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Bell size={20} color={Colors.light.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <User size={20} color={Colors.light.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'create' && styles.activeTabButton]}
          onPress={() => setActiveTab('create')}
        >
          <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>
            Create Ride
          </Text>
          {activeTab === 'create' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'available' && styles.activeTabButton]}
          onPress={() => setActiveTab('available')}
        >
          <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>
            Available Rides
          </Text>
          {activeTab === 'available' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'my' && styles.activeTabButton]}
          onPress={() => setActiveTab('my')}
        >
          <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>
            My Rides
          </Text>
          {activeTab === 'my' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {activeTab === 'create' && (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Animated.View 
              style={styles.formContainer}
              entering={FadeInDown.delay(300).duration(500)}
            >
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <MapPin size={20} color={Colors.light.subtext} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Starting Point"
                    value={startingPoint}
                    onChangeText={setStartingPoint}
                    placeholderTextColor={Colors.light.subtext}
                  />
                  <MapPin size={20} color={Colors.light.subtext} />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <MapPin size={20} color={Colors.light.subtext} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Destination"
                    value={destination}
                    onChangeText={setDestination}
                    placeholderTextColor={Colors.light.subtext}
                  />
                  <MapPin size={20} color={Colors.light.subtext} />
                </View>
              </View>

              <View style={styles.dateTimeContainer}>
                <View style={[styles.inputContainer, styles.dateInput]}>
                  <TextInput
                    style={styles.input}
                    placeholder="mm/dd/yyyy"
                    value={date}
                    onChangeText={setDate}
                    placeholderTextColor={Colors.light.subtext}
                  />
                  <Calendar size={20} color={Colors.light.subtext} />
                </View>

                <View style={[styles.inputContainer, styles.timeInput]}>
                  <TextInput
                    style={styles.input}
                    placeholder="--:-- --"
                    value={time}
                    onChangeText={setTime}
                    placeholderTextColor={Colors.light.subtext}
                  />
                  <Clock size={20} color={Colors.light.subtext} />
                </View>
              </View>

              <View style={styles.vehicleTypeContainer}>
                <TouchableOpacity 
                  style={[styles.vehicleButton, vehicleType === 'car' && styles.selectedVehicleButton]}
                  onPress={() => setVehicleType('car')}
                >
                  <CarIcon 
                    size={24} 
                    color={vehicleType === 'car' ? Colors.light.primary : Colors.light.text} 
                  />
                  <Text style={[styles.vehicleText, vehicleType === 'car' && styles.selectedVehicleText]}>
                    Car
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.vehicleButton, vehicleType === 'cng' && styles.selectedVehicleButton]}
                  onPress={() => setVehicleType('cng')}
                >
                  <Truck 
                    size={24} 
                    color={vehicleType === 'cng' ? Colors.light.primary : Colors.light.text} 
                  />
                  <Text style={[styles.vehicleText, vehicleType === 'cng' && styles.selectedVehicleText]}>
                    CNG
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.vehicleButton, vehicleType === 'rickshaw' && styles.selectedVehicleButton]}
                  onPress={() => setVehicleType('rickshaw')}
                >
                  <Bike 
                    size={24} 
                    color={vehicleType === 'rickshaw' ? Colors.light.primary : Colors.light.text} 
                  />
                  <Text style={[styles.vehicleText, vehicleType === 'rickshaw' && styles.selectedVehicleText]}>
                    Rickshaw
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.genderContainer}>
                <View style={styles.genderOption}>
                  <TouchableOpacity 
                    style={styles.radioButton}
                    onPress={() => setGender('male')}
                  >
                    <View style={[styles.radioOuter, gender === 'male' && styles.radioOuterSelected]}>
                      {gender === 'male' && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.genderText}>Male</Text>
                </View>

                <View style={styles.genderOption}>
                  <TouchableOpacity 
                    style={styles.radioButton}
                    onPress={() => setGender('female')}
                  >
                    <View style={[styles.radioOuter, gender === 'female' && styles.radioOuterSelected]}>
                      {gender === 'female' && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.genderText}>Female</Text>
                </View>

                <View style={styles.genderOption}>
                  <TouchableOpacity 
                    style={styles.radioButton}
                    onPress={() => setGender('any')}
                  >
                    <View style={[styles.radioOuter, gender === 'any' && styles.radioOuterSelected]}>
                      {gender === 'any' && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.genderText}>Any</Text>
                </View>
              </View>

              <View style={styles.ridersContainer}>
                <Text style={styles.ridersLabel}>Number of Co-Riders</Text>
                <TouchableOpacity style={styles.ridersSelector}>
                  <Text style={styles.ridersText}>{riders}</Text>
                  <ChevronDown size={20} color={Colors.light.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <View style={[styles.inputContainer, styles.notesInput]}>
                  <TextInput
                    style={[styles.input, styles.multilineInput]}
                    placeholder="Additional Notes (optional)"
                    value={notes}
                    onChangeText={setNotes}
                    placeholderTextColor={Colors.light.subtext}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.createButton}
                  onPress={handleCreateRide}
                >
                  <Text style={styles.createButtonText}>Create Ride</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.draftButton}
                  onPress={handleSaveDraft}
                >
                  <Text style={styles.draftButtonText}>Save Draft</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
            <View style={styles.bottomPadding} />
          </ScrollView>
        )}

        {activeTab === 'available' && (
          <FlatList
            data={availableRides}
            renderItem={renderAvailableRideItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <View style={styles.listHeader}>
                <View style={styles.searchFiltersContainer}>
                  <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterButtonText}>Filters</Text>
                    <ChevronDown size={16} color={Colors.light.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sortButton}>
                    <Text style={styles.sortButtonText}>Sort by: Nearest</Text>
                    <ChevronDown size={16} color={Colors.light.text} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.resultsText}>{availableRides.length} rides found</Text>
              </View>
            )}
            ListFooterComponent={() => <View style={styles.bottomPadding} />}
          />
        )}

        {activeTab === 'my' && (
          <FlatList
            data={myRides}
            renderItem={renderMyRideItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <View style={styles.listHeader}>
                <View style={styles.myRidesFilterContainer}>
                  <TouchableOpacity style={[styles.myRidesFilterButton, styles.myRidesFilterButtonActive]}>
                    <Text style={styles.myRidesFilterButtonTextActive}>Upcoming</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.myRidesFilterButton}>
                    <Text style={styles.myRidesFilterButtonText}>Past</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.myRidesFilterButton}>
                    <Text style={styles.myRidesFilterButtonText}>Cancelled</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListFooterComponent={() => <View style={styles.bottomPadding} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'Inter-SemiBold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 16,
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  activeTabButton: {
    backgroundColor: Colors.light.card,
  },
  tabText: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Medium',
  },
  activeTabText: {
    color: Colors.light.primary,
    fontFamily: 'Inter-SemiBold',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: Colors.light.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateInput: {
    width: '48%',
  },
  timeInput: {
    width: '48%',
  },
  vehicleTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  vehicleButton: {
    width: '31%',
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  selectedVehicleButton: {
    borderColor: Colors.light.primary,
    backgroundColor: '#F0EFFE',
  },
  vehicleText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  selectedVehicleText: {
    color: Colors.light.primary,
  },
  genderContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  radioButton: {
    marginRight: 8,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: Colors.light.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.primary,
  },
  genderText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  ridersContainer: {
    marginBottom: 16,
  },
  ridersLabel: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  ridersSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  ridersText: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  notesInput: {
    paddingVertical: 8,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  createButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    width: '48%',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  draftButton: {
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    width: '48%',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  draftButtonText: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  listContainer: {
    padding: 16,
  },
  listHeader: {
    marginBottom: 16,
  },
  searchFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EFFE',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  filterButtonText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginRight: 4,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sortButtonText: {
    color: Colors.light.text,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginRight: 4,
  },
  resultsText: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
  },
  myRidesFilterContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    padding: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  myRidesFilterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  myRidesFilterButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  myRidesFilterButtonText: {
    color: Colors.light.text,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  myRidesFilterButtonTextActive: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  rideCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  rideCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginLeft: 4,
    fontFamily: 'Inter-Regular',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.primary,
    fontFamily: 'Inter-SemiBold',
  },
  routeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
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
    backgroundColor: Colors.light.primary,
  },
  routePointDotDestination: {
    backgroundColor: Colors.light.error,
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
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  rideDetails: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  rideDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  rideDetailText: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginLeft: 5,
    fontFamily: 'Inter-Regular',
  },
  rideCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 16,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleText: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginLeft: 5,
    fontFamily: 'Inter-Regular',
  },
  joinButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  rideTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rideTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  passengersContainer: {
    marginBottom: 16,
  },
  passengersTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  passengersList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passengerImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.light.card,
  },
  availableSeatsContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
  },
  availableSeatsText: {
    fontSize: 12,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Medium',
  },
  driverInfoLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  driverImageLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  driverNameLarge: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  detailsButton: {
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  detailsButtonText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  cancelButton: {
    backgroundColor: '#FFF0F0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.light.error,
  },
  cancelButtonText: {
    color: Colors.light.error,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 80,
  },
});