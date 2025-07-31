import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

interface PermissionStatus {
  location: boolean;
  camera: boolean;
  mediaLibrary: boolean;
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<PermissionStatus>({
    location: false,
    camera: false,
    mediaLibrary: false,
  });
  const [loading, setLoading] = useState(true);

  const checkPermissions = async () => {
    try {
      setLoading(true);
      
      // Check location permission
      const locationStatus = await Location.getForegroundPermissionsAsync();
      
      // Check camera and media library permissions
      const cameraStatus = await ImagePicker.getCameraPermissionsAsync();
      const mediaLibraryStatus = await ImagePicker.getMediaLibraryPermissionsAsync();
      
      setPermissions({
        location: locationStatus.status === 'granted',
        camera: cameraStatus.status === 'granted',
        mediaLibrary: mediaLibraryStatus.status === 'granted',
      });
    } catch (error) {
      console.error('Error checking permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      
      setPermissions(prev => ({ ...prev, location: granted }));
      return granted;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  };

  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      const granted = status === 'granted';
      
      setPermissions(prev => ({ ...prev, camera: granted }));
      return granted;
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  };

  const requestMediaLibraryPermission = async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const granted = status === 'granted';
      
      setPermissions(prev => ({ ...prev, mediaLibrary: granted }));
      return granted;
    } catch (error) {
      console.error('Error requesting media library permission:', error);
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<Location.LocationObject | null> => {
    try {
      if (!permissions.location) {
        const granted = await requestLocationPermission();
        if (!granted) {
          throw new Error('Location permission denied');
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      return location;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  return {
    permissions,
    loading,
    requestLocationPermission,
    requestCameraPermission,
    requestMediaLibraryPermission,
    getCurrentLocation,
    checkPermissions,
  };
}