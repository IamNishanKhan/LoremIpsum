import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Search, Plus } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Colors from "../../constants/Colors";
import AnimatedPressable from "../../components/AnimatedPressable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../api_endpoint_url";
import { useToast } from "../../components/ToastProvider";
import RideCard from "../../components/Rides/RideCard"; // Import the RideCard component

export default function HomeScreen() {
  const [rides, setRides] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadUserProfile();
    fetchAvailableRides();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userData = await AsyncStorage.getItem("user_data");
      if (userData) {
        setUserProfile(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const fetchAvailableRides = async () => {
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
      } else {
        showToast("Failed to load available rides", "error");
      }
    } catch (error) {
      showToast("Network error while fetching rides", "error");
      console.error("Error fetching rides:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRide = () => {
    router.push("/createride");
  };

  const handleFindRide = () => {
    router.push("/rides");
  };

  const handleUserPress = (userId) => {
    router.push(`/user/${userId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello, {userProfile?.first_name || "Rider"}!
        </Text>
        <Text style={styles.subtitle}>Where would you like to go today?</Text>
      </View>

      <Animated.View
        style={styles.actionsContainer}
        entering={FadeInDown.delay(300).duration(500)}
      >
        <View style={{ flexDirection: "row", gap: 12 }}>
          <AnimatedPressable
            style={[styles.actionButton, { flex: 1 }]}
            onPress={handleFindRide}
          >
            <View style={styles.actionIcon}>
              <Search size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.actionTitle}>Find Ride</Text>
          </AnimatedPressable>

          <AnimatedPressable
            style={[styles.actionButton, { flex: 1 }]}
            onPress={handleCreateRide}
          >
            <View style={styles.actionIcon}>
              <Plus size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.actionTitle}>Create Ride</Text>
          </AnimatedPressable>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={styles.availableRidesContainer}
          entering={FadeInDown.delay(400).duration(500)}
        >
          <Text style={styles.sectionTitle}>Available Rides</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.light.primary} />
          ) : rides.length > 0 ? (
            <FlatList
              data={rides}
              renderItem={({ item }) => (
                <RideCard ride={item} onUserPress={handleUserPress} />
              )}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noRidesText}>No available rides found</Text>
          )}
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
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 8,
    fontFamily: "Inter-Bold",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.subtext,
    fontFamily: "Inter-Regular",
  },
  heroContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  heroImage: {
    width: "100%",
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
    backgroundColor: Colors.light.primary + "10",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 8,
    fontFamily: "Inter-SemiBold",
  },
  actionDescription: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: "Inter-Regular",
  },
  availableRidesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 16,
    fontFamily: "Inter-SemiBold",
  },
  noRidesText: {
    fontSize: 16,
    color: Colors.light.subtext,
    textAlign: "center",
    fontFamily: "Inter-Regular",
  },
});
