import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet,Text,View } from 'react-native';


function App(): React.JSX.Element {

  useEffect(() => {
    console.log('first')
  
    return () => {

    }
  }, [])
  

  return (
    <SafeAreaView>
      <View style={styles.backgroundStyle}>
        <StatusBar barStyle={'dark-content'} />
        <Text>Testing hhjhj</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundStyle : {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default App;
