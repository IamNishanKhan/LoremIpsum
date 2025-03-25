import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import Colors from "../../constants/Colors";
import AnimatedPressable from "../AnimatedPressable";
import { BASE_URL } from "../../app/api_endpoint_url"; // Import BASE_URL

const RideCard = ({ ride, onUserPress }) => {
  const handleRidePress = () => {
    router.push(`/ride/${ride.id}`);
  };

  return (
    <Animated.View entering={FadeInDown.delay(100).duration(400)}>
      <AnimatedPressable style={styles.rideCard} onPress={handleRidePress}>
        <View style={styles.rideHeader}>
          <View style={styles.rideInfo}>
            <Text style={styles.vehicleType}>{ride.vehicle_type}</Text>
            {ride.is_female_only && (
              <View style={styles.femaleOnlyBadge}>
                <Text style={styles.femaleOnlyText}>Female Only</Text>
              </View>
            )}
          </View>
          <Text style={styles.fareText}>৳{ride.total_fare}</Text>
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.routePoint}>
            <View style={styles.routeDot} />
            <Text style={styles.locationText}>From: {ride.pickup_name}</Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routePoint}>
            <View style={[styles.routeDot, styles.destinationDot]} />
            <Text style={styles.locationText}>To: {ride.destination_name}</Text>
          </View>
        </View>

        <View style={styles.rideDetails}>
          <Text style={styles.detailText}>
            {new Date(ride.departure_time).toLocaleString()}
          </Text>
          <Text style={styles.detailText}>
            {ride.seats_available} seats available
          </Text>
        </View>

        <View style={styles.hostInfo}>
          <TouchableOpacity
            style={styles.hostProfile}
            onPress={() => onUserPress(ride.host.id)}
          >
            {ride.host.profile_photo ? (
              <Image
                source={{
                  uri: ride.host.profile_photo
                    ? `${BASE_URL}${ride.host.profile_photo}`
                    : "https://via.placeholder.com/32",
                }}
                style={styles.hostImage}
                onError={() => (
                  <View style={styles.fallbackImage}>
                    <Text style={styles.fallbackText}>
                      {ride.host.first_name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              />
            ) : (
              <View style={styles.fallbackImage}>
                <Text style={styles.fallbackText}>
                  {ride.host.first_name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={styles.hostedBy}>
              Hosted by {ride.host.first_name} {ride.host.last_name}
            </Text>
          </TouchableOpacity>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  rideCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  rideHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  rideInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleType: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginRight: 8,
    fontFamily: "Inter-SemiBold",
  },
  femaleOnlyBadge: {
    backgroundColor: "#FFE5E5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  femaleOnlyText: {
    fontSize: 12,
    color: Colors.light.error,
    fontFamily: "Inter-Medium",
  },
  fareText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.primary,
    fontFamily: "Inter-SemiBold",
  },
  routeContainer: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: "row",
    alignItems: "center",
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
    fontFamily: "Inter-Regular",
  },
  rideDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailText: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: "Inter-Regular",
  },
  hostInfo: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 16,
  },
  hostProfile: {
    flexDirection: "row",
    alignItems: "center",
  },
  hostImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  hostedBy: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: "Inter-Medium",
  },
  fallbackImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    color: Colors.light.card,
    fontSize: 16,
    fontFamily: "Inter-Bold",
  },
});

export default RideCard;
