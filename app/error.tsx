import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView as SafeAreaViewREAL } from 'react-native-safe-area-context';

const SafeAreaView = true ? View : SafeAreaViewREAL;

export default function WereCooked() {
  return (
    <View style={styles.outerContainer}>
        <Text>You're on your own man, I hope you have a real map.</Text>
        {/* <ChromeDinoGame /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#000000',
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

