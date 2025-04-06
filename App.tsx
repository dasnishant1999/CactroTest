import 'react-native-reanimated';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SelectImagesScreen from './src/screens/SelectImagesScreen';
import SlideshowScreen from './src/screens/SlideshowScreen';
import {StyleSheet} from 'react-native';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SelectImages">
        <Stack.Screen name="SelectImages" component={SelectImagesScreen} />
        <Stack.Screen
          name="Slideshow"
          component={SlideshowScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
