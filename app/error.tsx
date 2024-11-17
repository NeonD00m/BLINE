import React from 'react';
import { StyleSheet, View, Text, Linking } from 'react-native';
import { SafeAreaView as SafeAreaViewREAL } from 'react-native-safe-area-context';
// import DinoGame from 'react-chrome-dino-ts';
// import 'react-chrome-dino-ts/index.css';
// import DinoGame from 'react-chrome-dino-ts';

export default function WereCooked() {
  return (
    <View style={styles.outerContainer}>
      <Text
        style={styles.bigText}
        // onPress={() => {
        //   Linking.openURL('chrome://dino/');
        // }}
      >
        You're on your own man, I hope you have a real map.
      </Text>
      {/* <ChromeDinoGame /> */}
      {/* <DinoGame /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  bigText: {
    fontSize: 20,
    textAlign: 'center',
  },
  outerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%'
  }
});

