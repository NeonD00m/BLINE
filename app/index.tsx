import { Modal, Text, View } from "react-native";
import MapView from 'react-native-maps';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Modal>
        <Text>hello this is in a modal</Text>
      </Modal>
      <MapView provider="google" googleMapId="MAIN_MAP_UNIQUE_ID">

      </MapView>
    </View>
  );
}
