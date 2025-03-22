import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, Plus, MapPin } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '../../constants/Colors';
import AnimatedPressable from '../../components/AnimatedPressable';

export default function HomeScreen() {
  const handleCreateRide = () => {
    router.push('/createride');
  };

  const handleFindRide = () => {
    router.push('/rides');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, Rider!</Text>
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
          style={styles.popularRoutesContainer}
          entering={FadeInDown.delay(400).duration(500)}
        >
          <Text style={styles.sectionTitle}>Popular Routes</Text>
          <View style={styles.routesList}>
            <AnimatedPressable style={styles.routeCard}>
              <MapPin size={20} color={Colors.light.primary} />
              <View style={styles.routeInfo}>
                <Text style={styles.routeName}>NSU to Banani</Text>
                <Text style={styles.routeStats}>15 rides today</Text>
              </View>
            </AnimatedPressable>

            <AnimatedPressable style={styles.routeCard}>
              <MapPin size={20} color={Colors.light.primary} />
              <View style={styles.routeInfo}>
                <Text style={styles.routeName}>NSU to Gulshan</Text>
                <Text style={styles.routeStats}>12 rides today</Text>
              </View>
            </AnimatedPressable>

            <AnimatedPressable style={styles.routeCard}>
              <MapPin size={20} color={Colors.light.primary} />
              <View style={styles.routeInfo}>
                <Text style={styles.routeName}>NSU to Uttara</Text>
                <Text style={styles.routeStats}>8 rides today</Text>
              </View>
            </AnimatedPressable>
          </View>
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
  popularRoutesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  routesList: {
    gap: 12,
  },
  routeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  routeInfo: {
    marginLeft: 12,
  },
  routeName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
    fontFamily: 'Inter-Medium',
  },
  routeStats: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
  },
});