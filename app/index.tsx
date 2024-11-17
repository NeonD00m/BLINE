import React, { useState, useEffect } from 'react';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView as SafeAreaViewREAL } from 'react-native-safe-area-context';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import WereCooked from './error';



import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';

const SafeAreaView = true ? View : SafeAreaViewREAL;
const GOOGLE_PLACES_API_KEY = 'AIzaSyDW22PGs1KSQEpLk7AOgPFREaUhaOCkqag';


export default function Index() {
  
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const mapRef = useRef(null);

  const fetchAutocomplete = async (input) => {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input
    )}&key=${GOOGLE_PLACES_API_KEY}&types=geocode`;

    try {
      const result = await fetch(apiUrl);
      const json = await result.json();
      if (json.predictions) {
        return json.predictions;
      } else {
        return [];
      }
    } catch (err) {
      console.error(err);
      return [];
    }
  };

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

  const fetchPlaceDetails = async (placeId) => {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_PLACES_API_KEY}`;

    try {
      const result = await fetch(apiUrl);
      const json = await result.json();
      if (json.result) {
        return json.result;
      } else {
        return null;
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleSuggestionPress = async (item) => {
    const placeDetails = await fetchPlaceDetails(item.place_id);
    if (placeDetails) {
      const { lat, lng } = placeDetails.geometry.location;
      mapRef.current.animateToRegion(
        {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );
      setSearchText(item.description);
      setSuggestions([]);
    }
  };

  const [location, setLocation] = useState({
    enabled: false,
    latitude: 37.34924530703096,
    longitude: -121.93673748980143,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // setErrorMsg('Permission to access location was denied');
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
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
        />
        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item: { place_id: any; }) => item.place_id}
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