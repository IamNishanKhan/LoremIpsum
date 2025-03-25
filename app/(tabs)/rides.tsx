import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Search, Filter, Car, Bike, Truck, Plus } from "lucide-react-native";
import Animated from "react-native-reanimated";
import Colors from "../../constants/Colors";
import { useToast } from "../../components/ToastProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../api_endpoint_url";
import RideCard from "../../components/Rides/RideCard";

const vehicleTypes = [
  { id: "all", label: "All", icon: Car },
  { id: "Private Car", label: "Car", icon: Car },
  { id: "Private Bike", label: "Bike", icon: Bike },
  { id: "CNG", label: "CNG", icon: Truck },
];

export default function RidesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVehicleType, setSelectedVehicleType] = useState("all");
  const [showFemaleOnly, setShowFemaleOnly] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userGender, setUserGender] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchUserProfile();
    fetchRides();
  }, []);

  // Ensure filterRides runs when these dependencies change
  useEffect(() => {
    filterRides();
  }, [searchQuery, selectedVehicleType, showFemaleOnly, rides]);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const response = await fetch(`${BASE_URL}/api/users/profile/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUserGender(data.gender?.toLowerCase());
      } else {
        showToast("Failed to load user profile", "error");
      }
    } catch (error) {
      showToast("Network error while loading profile", "error");
      console.error("Error fetching profile:", error);
    }
  };

  const fetchRides = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("access_token");
      const response = await fetch(`${BASE_URL}/api/rides/list/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setRides(data);
        setFilteredRides(data); // Initially set filteredRides to all rides
      } else {
        showToast("Failed to load rides", "error");
      }
    } catch (error) {
      showToast("Network error while fetching rides", "error");
      console.error("Error fetching rides:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRides = () => {
    let filtered = [...rides];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((ride) =>
        [
          ride.pickup_name,
          ride.destination_name,
          ride.host.first_name,
          ride.host.last_name,
        ].some((field) =>
          field?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Vehicle type filter
    if (selectedVehicleType !== "all") {
      filtered = filtered.filter(
        (ride) =>
          ride.vehicle_type.toLowerCase() === selectedVehicleType.toLowerCase()
      );
    }

    // Female only filter
    if (showFemaleOnly) {
      filtered = filtered.filter((ride) => ride.is_female_only === true);
    }

    setFilteredRides(filtered);
  };

  const handleJoinWithCode = async () => {
    if (!joinCode.trim()) {
      showToast("Please enter a join code", "error");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("access_token");
      const response = await fetch(`${BASE_URL}/api/rides/join-by-code/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ride_code: joinCode }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Successfully joined ride", "success");
        router.push(`/ride/${data.ride.id}`);
      } else {
        showToast(data.message || "Failed to join ride", "error");
      }
    } catch (error) {
      showToast("Network error while joining ride", "error");
      console.error("Error joining ride:", error);
    }
    setJoinCode("");
  };

  const handleCreateRide = () => {
    router.push("/createride");
  };

  const handleUserPress = (userId) => {
    router.push(`/user/${userId}`);
  };

  const isFemaleOnlyDisabled = userGender === "male";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Rides</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateRide}
        >
          <Plus size={24} color={Colors.light.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.light.subtext} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search rides..."
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              filterRides(); // Trigger filtering on text change
            }}
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
                selectedVehicleType === type.id && styles.filterButtonActive,
              ]}
              onPress={() => {
                setSelectedVehicleType(type.id);
                filterRides(); // Trigger filtering on vehicle type change
              }}
            >
              <type.icon
                size={16}
                color={
                  selectedVehicleType === type.id
                    ? Colors.light.card
                    : Colors.light.text
                }
              />
              <Text
                style={[
                  styles.filterButtonText,
                  selectedVehicleType === type.id &&
                    styles.filterButtonTextActive,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.filtersContainer, { flexDirection: "column" }]}>
        <TouchableOpacity
          style={[
            styles.femaleOnlyButton,
            showFemaleOnly && styles.femaleOnlyButtonActive,
            isFemaleOnlyDisabled && styles.femaleOnlyButtonDisabled,
          ]}
          onPress={() => {
            if (!isFemaleOnlyDisabled) {
              setShowFemaleOnly(!showFemaleOnly);
              filterRides(); // Trigger filtering on female only change
            }
          }}
          disabled={isFemaleOnlyDisabled}
        >
          <Text
            style={[
              styles.femaleOnlyButtonText,
              showFemaleOnly && styles.femaleOnlyButtonTextActive,
              isFemaleOnlyDisabled && styles.femaleOnlyButtonTextDisabled,
            ]}
          >
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

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredRides}
          renderItem={({ item }) => (
            <RideCard ride={item} onUserPress={handleUserPress} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.ridesList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.noRidesText}>No rides available</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.light.text,
    fontFamily: "Inter-Bold",
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: Colors.light.card,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
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
    fontFamily: "Inter-Regular",
  },
  filtersContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    alignItems: "center",
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
    fontFamily: "Inter-Medium",
  },
  filterButtonTextActive: {
    color: Colors.light.card,
  },
  femaleOnlyButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    width: "100%",
  },
  femaleOnlyButtonActive: {
    backgroundColor: "#FF69B4",
    borderColor: "#FF69B4",
  },
  femaleOnlyButtonDisabled: {
    opacity: 0.5,
  },
  femaleOnlyButtonText: {
    textAlign: "center",
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: "Inter-Medium",
  },
  femaleOnlyButtonTextActive: {
    color: Colors.light.card,
  },
  femaleOnlyButtonTextDisabled: {
    color: Colors.light.subtext,
  },
  joinCodeContainer: {
    flexDirection: "row",
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
    fontFamily: "Inter-Regular",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  joinCodeButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  joinCodeButtonText: {
    color: Colors.light.card,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
  },
  ridesList: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noRidesText: {
    fontSize: 16,
    color: Colors.light.subtext,
    textAlign: "center",
    fontFamily: "Inter-Regular",
    padding: 20,
  },
});
