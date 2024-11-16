import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView as SafeAreaViewREAL } from 'react-native-safe-area-context';

const SafeAreaView = true ? View : SafeAreaViewREAL;

export default function Index() {
  const [location, setLocation] = useState({
    enabled: false,
    latitude: 37.34924530703096,
    longitude: -121.93673748980143,
    latitudeDelta: 0,
    longitudeDelta: 0});
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
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  if (!location) { return <Text>You're on your own man, I believe in you</Text>; }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000000"
      }}
    >

      <SafeAreaView>
        <View style={styles.container}>
          <Text>fiewhuafwefiu</Text>
          <MapView initialRegion={location} style={styles.map} provider="google" googleMapId="MAIN_MAP_UNIQUE_ID" showsTraffic >

          </MapView>
        </View>
      </SafeAreaView>
      {/* <Modal>
        <Text>hello this is in a modal</Text>
      </Modal> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // width: '100%',
    // height: '100%',
  },
  map: {
    // flex: 1,
    // width: '100%',
    // height: '100%',
    ...StyleSheet.absoluteFillObject,
  },
});
