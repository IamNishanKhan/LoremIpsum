import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Platform, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, Plus, MapPin, Flag, Clock, ChevronRight, Bell } from "lucide-react-native";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeInDown } from "react-native-reanimated";
import Colors from "../../constants/Colors";
import AnimatedPressable from "../../components/AnimatedPressable";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";


const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [searchText, setSearchText] = useState("");
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541");
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyRides, setNearbyRides] = useState([]);

  // Load user data from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user_data");
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.first_name);
          if (user.profile_photo) {
            setUserImage(user.profile_photo);
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    loadUserData();
  }, []);

  // Get user's current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    })();
  }, []);

  // Fetch nearby rides when location is available
  useEffect(() => {
    if (userLocation) {
      fetchNearbyRides(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation]);

  // Function to fetch nearby rides
  async function fetchNearbyRides(lat, lon) {
    try {
      // Note: Since the provided example is for geocoding, I'm assuming a hypothetical
      // rides endpoint that follows a similar pattern and returns ride data with coordinates
      const config = {
        method: "get",
        url: `https://maps-api.pathao.io/v1/rides/nearby?lat=${lat}&lon=${lon}`,
        headers: {
          Authorization: "SESYVMVADVCPSDXCCL6AEWKOEJWINEJ24NKNCII62QUFWVEX36RHAJJQ4QH7NSRTGOLYF6HRAIDC3GFWJ3NG7HDQE523IR4DSWYIBFLH5OTLLDQ4Y2NLZHSRRVOTNCL3H6LHLQDRSMRLI3STKWZ3BLRPCZSC5K553LTSOPBCO5K3UODYRC2Q3YPQZAXTVQLYSJL5DD3GC7HZ3QMGEPKDDV3N6W3D5O42VSTY6KR6SU62SECEM435IGU3FVYBYTBCDHKOQHWH",
        },
      };
      const response = await axios.request(config);
      // Assuming response.data.rides contains array of rides with id, pickup_latitude, pickup_longitude, title, description
      setNearbyRides(response.data.rides || []);
    } catch (error) {
      console.error("Error fetching nearby rides:", error);
    }
  }

  const recentActivity = [
    {
      id: "1",
      title: "Downtown",
      subtitle: "Autumn Park",
      icon: "🏙️",
      time: "2 days ago",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Hello, {userName}!</Text>
          <Text style={styles.readyText}>Ready to ride?</Text>
        </View>

        <TouchableOpacity style={styles.profileButton} onPress={() => router.push("/profile")}>
          <Image source={{ uri: userImage }} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={styles.searchContainer} entering={FadeInDown.delay(300).duration(500)}>
          <View style={styles.searchBar}>
            <Search size={20} color={Colors.light.subtext} style={styles.searchIcon} />
            <TextInput style={styles.searchInput} placeholder="Search rides by destination name..." value={searchText} onChangeText={setSearchText} placeholderTextColor={Colors.light.subtext} />
          </View>
        </Animated.View>

        <Animated.View style={styles.quickActionsContainer} entering={FadeInDown.delay(400).duration(500)}>
          <AnimatedPressable style={styles.quickActionButton}>
            <View style={styles.quickActionIconContainer}>
              <Search size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.quickActionText}>Find a Ride</Text>
          </AnimatedPressable>

          <AnimatedPressable style={styles.quickActionButton}>
            <View style={styles.quickActionIconContainer}>
              <Plus size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.quickActionText}>Create a Ride</Text>
          </AnimatedPressable>

          <AnimatedPressable style={styles.quickActionButton}>
            <View style={styles.quickActionIconContainer}>
              <MapPin size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.quickActionText}>Saved</Text>
          </AnimatedPressable>

          <AnimatedPressable style={styles.quickActionButton}>
            <View style={styles.quickActionIconContainer}>
              <Flag size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.quickActionText}>Report Issue</Text>
          </AnimatedPressable>
        </Animated.View>

        <Animated.View style={styles.sectionContainer} entering={FadeInDown.delay(500).duration(500)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>Show All</Text>
            </TouchableOpacity>
          </View>

          {recentActivity.map((activity) => (
            <AnimatedPressable key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Text style={styles.activityIcon}>{activity.icon}</Text>
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
              </View>
              <View style={styles.activityTimeContainer}>
                <Clock size={14} color={Colors.light.subtext} />
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </AnimatedPressable>
          ))}
        </Animated.View>

        {/* Updated Nearby Rides Section */}
        <Animated.View style={styles.sectionContainer} entering={FadeInDown.delay(600).duration(500)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Rides</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>Map View</Text>
            </TouchableOpacity>
          </View>

          {Platform.OS !== 'web' && userLocation ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                }}
                title="Your Location"
                pinColor="blue"
              />
              {nearbyRides.map((ride) => (
                <Marker
                  key={ride.id}
                  coordinate={{
                    latitude: ride.pickup_latitude,
                    longitude: ride.pickup_longitude,
                  }}
                  title={ride.title}
                  description={ride.description}
                />
              ))}
            </MapView>
          ) : (
            <View style={[styles.map, styles.mapPlaceholder]}>
              <Text style={styles.mapPlaceholderText}>Map not available in web view</Text>
            </View>
          )}
        </Animated.View>

        <Animated.View style={styles.sectionContainer} entering={FadeInDown.delay(700).duration(500)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>

          <AnimatedPressable style={styles.notificationItem}>
            <View style={styles.notificationIconContainer}>
              <Bell size={20} color="#FFFFFF" />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>New ride alerts found!</Text>
              <Text style={styles.notificationSubtitle}>Compare 3 routes to Downtown</Text>
            </View>
            <ChevronRight size={20} color={Colors.light.subtext} />
          </AnimatedPressable>
        </Animated.View>

        <View style={styles.bottomPadding} />
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  greeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.light.text,
    fontFamily: "Inter-SemiBold",
  },
  readyText: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: "Inter-Regular",
    marginTop: 2,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: "Inter-Regular",
  },
  quickActionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  quickActionButton: {
    width: (width - 40) / 2,
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    height: 90,
  },
  quickActionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F0EFFE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: "Inter-Medium",
    textAlign: "center",
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    fontFamily: "Inter-SemiBold",
  },
  sectionAction: {
    fontSize: 14,
    color: Colors.light.primary,
    fontFamily: "Inter-Medium",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0EFFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityIcon: {
    fontSize: 18,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
    fontFamily: "Inter-Medium",
  },
  activitySubtitle: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: "Inter-Regular",
    marginTop: 2,
  },
  activityTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityTime: {
    fontSize: 12,
    color: Colors.light.subtext,
    fontFamily: "Inter-Regular",
    marginLeft: 4,
  },
  map: {
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  notificationIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
    fontFamily: "Inter-Medium",
  },
  notificationSubtitle: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: "Inter-Regular",
    marginTop: 2,
  },
  bottomPadding: {
    height: 20,
  },
});
