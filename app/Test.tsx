// import React, { useState, useEffect } from 'react';
// import * as Location from 'expo-location';
// import { SafeAreaView as SafeAreaViewREAL } from 'react-native-safe-area-context';
// import WereCooked from './error';
// import MapView, { Polyline, Marker } from 'react-native-maps';
// import polyline from '@mapbox/polyline';

// import {
//   StyleSheet,
//   View,
//   TextInput,
//   FlatList,
//   TouchableOpacity,
//   Text,
// } from 'react-native';

// const SafeAreaView = true ? View : SafeAreaViewREAL;
// const GOOGLE_PLACES_API_KEY = 'AIzaSyDW22PGs1KSQEpLk7AOgPFREaUhaOCkqag';

// const [routeCoords, setRouteCoords] = useState([]);
// const [destination, setDestination] = useState(null);


// export default function Index() {
  
//   const [searchText, setSearchText] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const mapRef = useRef(null);

//   const fetchAutocomplete = async (input) => {
//     const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
//       input
//     )}&key=${GOOGLE_PLACES_API_KEY}&types=geocode`;

//     try {
//       const result = await fetch(apiUrl);
//       const json = await result.json();
//       if (json.predictions) {
//         return json.predictions;
//       } else {
//         return [];
//       }
//     } catch (err) {
//       console.error(err);
//       return [];
//     }
//   };

//     useEffect(() => {
//     let isCancelled = false;
//     if (searchText.length > 2) {
//       fetchAutocomplete(searchText).then((results) => {
//         if (!isCancelled) {
//           setSuggestions(results);
//         }
//       });
//     } else {
//       setSuggestions([]);
//     }
//     return () => {
//       isCancelled = true;
//     };
//   }, [searchText]);

//   const fetchPlaceDetails = async (placeId) => {
//     const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_PLACES_API_KEY}`;

//     try {
//       const result = await fetch(apiUrl);
//       const json = await result.json();
//       if (json.result) {
//         return json.result;
//       } else {
//         return null;
//       }
//     } catch (err) {
//       console.error(err);
//       return null;
//     }
//   };

//   const getDirections = async (originLat: any, originLng: any, destLat: any, destLng: any) => {
//   try {
//     const resp = await fetch(
//       `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destLat},${destLng}&key=${AIzaSyDW22PGs1KSQEpLk7AOgPFREaUhaOCkqag}`
//     );
//     const respJson = await resp.json();
//     if (respJson.routes.length) {
//       const points = polyline.decode(
//         respJson.routes[0].overview_polyline.points
//       );
//       const coords = points.map((point: any[]) => ({
//         latitude: point[0],
//         longitude: point[1],
//       }));
//       setRouteCoords(coords);

//       mapRef.current.fitToCoordinates(coords, {
//         edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
//         animated: true,
//       });
//     }
//   } catch (error) {
//     console.error('Error fetching directions:', error);
//   }
// };

//   const handleSuggestionPress = async (item: { place_id: any; description: any; }) => {
//   const placeDetails = await fetchPlaceDetails(item.place_id);
//   if (placeDetails) {
//     const { lat, lng } = placeDetails.geometry.location;
//     setSearchText(item.description);
//     setSuggestions([]);
//     setDestination({ latitude: lat, longitude: lng });
//     getDirections(location.latitude, location.longitude, lat, lng);
//   }
// };

//   const [location, setLocation] = useState({
//     enabled: false,
//     latitude: 37.34924530703096,
//     longitude: -121.93673748980143,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421
//   });

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         return;
//       }

//       let { coords } = await Location.getCurrentPositionAsync({});
//       setLocation({
//         enabled: true,
//         latitude: coords.latitude,
//         longitude: coords.longitude,
//         latitudeDelta: 0.0922,
//         longitudeDelta: 0.0421
//       });
//     })();
//   }, []);

//   if (!location.enabled) {
//     return <WereCooked />;
//   }

//   return (
//     <View style={styles.outerContainer}>
//       <SafeAreaView style={styles.container}>
//         <MapView
//           ref={mapRef}
//           initialRegion={location}
//           style={styles.map}
//           provider="google"
//           showsTraffic
//         >
//           <Marker coordinate={location} title="Origin" />
//           {destination && <Marker coordinate={destination} title="Destination" />}
//           {routeCoords.length > 0 && (
//             <Polyline coordinates={routeCoords} strokeWidth={4} strokeColor="red" />
//           )}
//         </MapView>

//         <View style={styles.searchContainer}>
//             <TextInput
//               style={styles.searchBar}
//               placeholder="Search"
//               value={searchText}
//               onChangeText={setSearchText}
//             />
//             {suggestions.length > 0 && (
//               <FlatList
//                 data={suggestions}
//                 keyExtractor={(item: { place_id: any; }) => item.place_id}
//                 renderItem={({ item }) => (
//                   <TouchableOpacity
//                     style={styles.suggestionItem}
//                     onPress={() => handleSuggestionPress(item)}
//                   >
//                     <Text>{item.description}</Text>
//                   </TouchableOpacity>
//                 )}
//                 style={styles.suggestionsList}
//                 keyboardShouldPersistTaps="handled"
//               />
//             )}
//           </View>
//         </SafeAreaView>
//       </View>
//     );
// }

// const styles = StyleSheet.create({
//   outerContainer: {
//     flex: 1,
//     backgroundColor: '#000000'
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   searchBar: {
//     height: 50,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 5,
//     paddingHorizontal: 20,
//     fontSize: 18,
//   },
//   listView: {
//     backgroundColor: "#FFFFFF",
//   },
//   suggestionsList: {
//     backgroundColor: '#fff',
//     maxHeight: 200,
//   },
//   suggestionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   map: {
//     flex: 1,
//     width: '100%',
//     height: '100%'
//   }
// });