import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { db } from '@/firebase/config';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeHerColors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

const userId = 'mockUser';

export default function PanicModeScreen() {
  const { alertId } = useLocalSearchParams();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Permission to access location was denied');
        router.back();
        return;
      }

      let initialLocation = await Location.getCurrentPositionAsync({});
      setLocation(initialLocation);
    })();
  }, []);

  useEffect(() => {
    if (!alertId || !location) return;

    const locationHistoryRef = collection(db, 'PanicAlerts', alertId as string, 'LocationHistory');
    const interval = setInterval(async () => {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      addDoc(locationHistoryRef, {
        coords: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          accuracy: currentLocation.coords.accuracy,
        },
        timestamp: serverTimestamp(),
      });
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [alertId, location]);

  const handleEndAlert = async () => {
    if (!alertId) return;
    const alertRef = doc(db, 'PanicAlerts', alertId as string);
    await updateDoc(alertRef, { status: 'ended' });
    router.replace('/(tabs)');
  };

  return (
    <ThemedView style={styles.container}>
      {location ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
          >
            <View style={styles.pulsatingMarker}>
              <View style={styles.markerDot} />
            </View>
          </Marker>
        </MapView>
      ) : (
        <ThemedText>Loading map...</ThemedText>
      )}
      <View style={styles.footer}>
        <ThemedText type="subtitle" style={styles.footerText}>Panic Mode Activated</ThemedText>
        <ThemedText style={styles.footerSubtext}>Your location is being shared with your emergency contacts.</ThemedText>
        <PrimaryButton title="End Alert" onPress={handleEndAlert} variant="danger" />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: Layout.spacing.lg,
    borderTopLeftRadius: Layout.borderRadius.lg,
    borderTopRightRadius: Layout.borderRadius.lg,
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    marginBottom: Layout.spacing.sm,
  },
  footerSubtext: {
    color: 'white',
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  pulsatingMarker: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(244, 114, 182, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: SafeHerColors.primary,
  },
});