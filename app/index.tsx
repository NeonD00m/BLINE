import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView as SafeAreaViewREAL } from 'react-native-safe-area-context';
import wereCooked from './error';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const SafeAreaView = true ? View : SafeAreaViewREAL;

export default function Index() {
  const [location, setLocation] = useState({
    enabled: false,
    latitude: 37.34924530703096,
    longitude: -121.93673748980143,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  });
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation({
        enabled: true,
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      });
    })();
  }, []);

  if (!location.enabled) {
    return <WereCooked />;
  }

  return (
    <View style={styles.outerContainer}>
      <SafeAreaView style={styles.container}>
        <MapView
          initialRegion={location}
          style={styles.map}
          provider="google"
          googleMapId="MAIN_MAP_UNIQUE_ID"
          showsTraffic
        />

    <View style={styles.searchContainer}>
      <GooglePlacesAutocomplete
        placeholder="Search"
        onPress={(data, details = null) => {
          console.log(data, details);
        }}
        query={{
          key: 'YOUR_GOOGLE_PLACES_API_KEY',
          language: 'en',
        }}
        styles={{
          textInput: styles.searchBar,
          listView: styles.listView,
        }}
        fetchDetails={true}
      />
    </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#000000'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchBar: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingHorizontal: 20,
    fontSize: 18,
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%'
  }
});