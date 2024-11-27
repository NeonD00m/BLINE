import polyline from '@mapbox/polyline';
// import {GOOGLE_MAPS_API} from 'react-native-dotenv';

const GOOGLE_MAPS_API = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API;
const USE_GOOGLE = false;

export const fetchAutocomplete = async (input) => {
  const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${GOOGLE_MAPS_API}&types=geocode`;

  try {
    const result = await fetch(apiUrl);
    const json = await result.json();
    console.log(json); // Log the API response
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

export const fetchPlaceDetails = async (placeId: any) => {
  const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API}`;

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

export const getDirections = async (originLat, originLng, destLat, destLng) => {
  try {
    if (USE_GOOGLE) {
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destLat},${destLng}&key=${GOOGLE_MAPS_API}`
        
        const resp = await fetch(url);
        const respJson = await resp.json();
        if (respJson.routes.length) {
            const points = polyline.decode(respJson.routes[0].overview_polyline.points);
            const coords = points.map((point) => ({
                latitude: point[0],
                longitude: point[1],
            }));
            return coords;
        }
    } else {
        const url = `http://ec2-34-215-233-161.us-west-2.compute.amazonaws.com:5000//search?locn=${originLat},${originLng}&dest=${destLat},${destLng}`;
        
        const resp = await fetch(url);
        const respJson = await resp.json();
        if (respJson.coord_pairs != null) {
            const coords = respJson.map((point) => ({
                latitude: point[1],
                longitude: point[0],
            }));
            return coords;
        }
    }

    // const url = USE_GOOGLE ?
    // `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destLat},${destLng}&key=${GOOGLE_MAPS_API}`
    // : `http://ec2-54-187-217-109.us-west-2.compute.amazonaws.com:5000/search?locn=${originLat},${originLng}&dest=${destLat},${destLng}`;

    // // console.log("*\n*\n*\n*\n*\n*\n*");
    // // console.log("URLLLLLL:", url);
    
    // const resp = await fetch(url);
    // // console.log("RESPPPPP:", resp);
    // const respJson = await resp.json();
    // // console.log("*\n*\n*\n*\n*\n*\n*");
    // // console.log(respJson);
    // // console.log("*\n*\n*\n*\n*\n*\n*");
    // // console.log(respJson.coord_pairs);

    // if (respJson.coord_pairs != null) {//.routes.length) {
    //   const points = null;//polyline.decode(respJson.routes[0].overview_polyline.points);
    //   const coords = respJson.map((point) => ({
    //     latitude: point[0],
    //     longitude: point[1],
    //   }));
    //   return coords;
    // }
  } catch (error) {
    console.error('Error fetching directions:', error);
  }
  return [];
};

// export default {
//     fetchAutocomplete,
//     fetchPlaceDetails,
//     getDirections
// }