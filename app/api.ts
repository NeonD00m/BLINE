import polyline from '@mapbox/polyline';

const GOOGLE_PLACES_API_KEY = 'INSERT KE HERE';

export const fetchAutocomplete = async (input) => {
  const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${GOOGLE_PLACES_API_KEY}&types=geocode`;

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

export const getDirections = async (originLat, originLng, destLat, destLng) => {
  try {
    // const resp = await fetch(
    //  `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destLat},${destLng}&key=${GOOGLE_PLACES_API_KEY}`
    // );
    const resp = await fetch(
      `http://ec2-98-81-216-61.compute-1.amazonaws.com:5000/search?locn=(${originLat},${originLng})&dest=(${destLat}, ${destLng})`
    );
    const respJson = await resp.json();
    if (respJson.routes.length) {
      const points = polyline.decode(respJson.routes[0].overview_polyline.points);
      const coords = points.map((point) => ({
        latitude: point[0],
        longitude: point[1],
      }));
      return coords;
    }
  } catch (error) {
    console.error('Error fetching directions:', error);
  }
  return [];
};
