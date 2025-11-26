import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';


// maybe considerar os mapas do Expo e nao no React Native?
// fica menos parecido com o Google Maps, talvez?
export default function App() {
  return (
    <View style={styles.container}>

      <MapView style={styles.map} 

        
      
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
