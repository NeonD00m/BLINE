import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView as SafeAreaViewREAL } from 'react-native-safe-area-context';
import WereCooked from './error';
import polyline from '@mapbox/polyline';
import AntDesign from '@expo/vector-icons/AntDesign';
import { fetchAutocomplete, fetchPlaceDetails, getDirections } from './api'

const SafeAreaView = true ? View : SafeAreaViewREAL;
const GOOGLE_PLACES_API_KEY = 'AIzaSyDW22PGs1KSQEpLk7AOgPFREaUhaOCkqag';

export default function Index() {
  const textInputRef = useRef(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [destination, setDestination] = useState(null);
  const [searchBarPosition, setSearchBarPosition] = useState('bottom');
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const mapRef = useRef(null);
  const [location, setLocation] = useState({
    enabled: false,
    latitude: 37.34924530703096,
    longitude: -121.93673748980143,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  });

  let dynamicStyles = StyleSheet.create({
    searchContainer: {
      position: 'absolute',
      width: '90%',
      alignSelf: 'center',
      zIndex: 1,
      borderColor: "#000000",
      borderWidth: 1,
      top: searchBarPosition === 'top' ? 50 : undefined,
      bottom: searchBarPosition === 'bottom' ? 50 : undefined,
    },
  });

  const enterLocation = () => {
    if (textInputRef.current) {
      textInputRef.current.blur();
    }
    setSearchBarPosition('top');
    setSuggestions([]);
  }

  const handleEnterPress = async () => {
    if (destination) {
      const coords = await getDirections(location.latitude, location.longitude, destination.latitude, destination.longitude);
      setRouteCoords(coords);
      enterLocation();
    }
  };

  // const fetchAutocomplete = async (input: string | number | boolean) => {
  //   const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
  //     input
  //   )}&key=${GOOGLE_PLACES_API_KEY}&types=geocode`;

  //   try {
  //     const result = await fetch(apiUrl);
  //     const json = await result.json();
  //     console.log(json); // Log the API response
  //     if (json.predictions) {
  //       return json.predictions;
  //     } else {
  //       return [];
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     return [];
  //   }
  // };

  useEffect(() => {
    let isCancelled = false;
    if (searchText.length > 2) {
      fetchAutocomplete(searchText).then((results) => {
        if (!isCancelled) {
          setSuggestions(results);
        }
      });
    } else {
      setSuggestions([]);
    }
    return () => {
      isCancelled = true;
    };
  }, [searchText]);

  // const fetchPlaceDetails = async (placeId: any) => {
  //   const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_PLACES_API_KEY}`;

  //   try {
  //     const result = await fetch(apiUrl);
  //     const json = await result.json();
  //     if (json.result) {
  //       return json.result;
  //     } else {
  //       return null;
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     return null;
  //   }
  // };

  // const getDirections = async (originLat: any, originLng: any, destLat: any, destLng: any) => {
  //   try {
  //     const resp = await fetch(
  //       `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&mode=driving%20MA&destination=${destLat},${destLng}&key=${GOOGLE_PLACES_API_KEY}`
  //     );
  //     const respJson = await resp.json();
  //     if (respJson.routes.length && mapRef.current != null) {
  //       const points = polyline.decode(
  //         respJson.routes[0].overview_polyline.points
  //       );
  //       const coords = points.map((point: any[]) => ({
  //         latitude: point[0],
  //         longitude: point[1],
  //       }));
  //       setRouteCoords(coords);

  //       // mapRef.current.fitToCoordinates(coords, {
  //       //   edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
  //       //   animated: true,
  //       // });
  //     }
  //   } catch (error) {
  //     console.error('Error fetching directions:', error);
  //   }
  // };

  const handleSuggestionPress = async (item: { place_id: any; description: any; }) => {
    const placeDetails = await fetchPlaceDetails(item.place_id);
    if (placeDetails && mapRef.current != null) {
      const { lat, lng } = placeDetails.geometry.location;
      setSearchText(item.description);
      setDestination({ latitude: lat, longitude: lng });
      enterLocation();

      const coords = await getDirections(location.latitude, location.longitude, lat, lng);
      setRouteCoords(coords);
    }
  };

  const handleUserLocationChange = (event) => {
    const { latitude, longitude, heading } = event.nativeEvent.coordinate;
    const newCamera = {
      center: { latitude, longitude, },
      pitch: 45, // Adjust pitch as needed
      heading, // Adjust heading to user's direction 
      zoom: 18, // Adjust zoom level as needed
    };
    if (mapRef.current) {
      mapRef.current.animateCamera(newCamera, { duration: 3000 }); // Animate over 1 second
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
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
    return (
      <WereCooked />
    );
  }

  try {
    return (
      <View style={styles.outerContainer}>
        <SafeAreaView style={styles.container}>
          <MapView
            ref={mapRef}
            initialRegion={location}
            style={styles.map}
            provider="google"
            showsTraffic
            showsUserLocation={true}
            // followsUserLocation={true}
            userLocationPriority='high'
            onUserLocationChange={handleUserLocationChange}
          >
            {/* <Marker coordinate={location} title="Origin" image={require('../assets/myLocation.png')} /> */}
            {destination && <Marker coordinate={destination} title="Destination" />}
            {routeCoords.length > 0 && (
              <Polyline coordinates={routeCoords} strokeWidth={4} strokeColor="red" />
            )}
          </MapView>

          <View style={dynamicStyles.searchContainer}>
            {/* <TextInput
              style={styles.searchBar}
              placeholder="Search"
              value={searchText}
              onChangeText={setSearchText}
            /> */}
            <View style={styles.searchBar}>
              <TextInput
                style={styles.searchBar}
                placeholder="Search"
                value={searchText}
                onChangeText={(text) => {
                  setSearchBarPosition('bottom');
                  setSearchText(text);
                }}
                onSubmitEditing={handleEnterPress}
                numberOfLines={1}
                ref={textInputRef}
              />
              <TouchableOpacity onPress={handleEnterPress} style={styles.searchIcon}>
                {/* <Icon name="search" size={20} color="#000" /> */}
                {/* <FontAwesome name="search" size={24} color="black" /> */}
                <AntDesign name="search1" size={24} color="black" />
              </TouchableOpacity>
            </View>
            {suggestions.length > 0 && (
              <FlatList
                data={suggestions}
                keyExtractor={(item: any) => item.place_id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionPress(item)}
                  >
                    <Text>{item.description}</Text>
                  </TouchableOpacity>
                )}
                style={styles.suggestionsList}
                keyboardShouldPersistTaps="handled"
              />
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  } catch (e) {
    return (
      <WereCooked />
    );
  }
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
  searchContainer: {
    position: 'absolute',
    bottom: 50,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    zIndex: 1,
    borderColor: "#000000",
    borderWidth: 1,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingHorizontal: 10,
    // paddingLeft: 0,
    fontSize: 18,
  },
  searchIcon: {
    padding: 10,
  },
  searchBar: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingHorizontal: 16,
    fontSize: 18,
  },
  listView: {
    backgroundColor: "#FFFFFF",
  },
  suggestionsList: {
    backgroundColor: '#fff',
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%'
  }
});