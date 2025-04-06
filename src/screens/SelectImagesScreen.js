import React, {useState} from 'react';
import {View, Button, FlatList, Image, Alert} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

export default function SelectImagesScreen({navigation}) {
  const [images, setImages] = useState([]);

  const pickImages = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 5,
      },
      response => {
        if (response.assets) {
          const uris = response.assets.map(a => a.uri);
          if (uris.length >= 3) {
            setImages(uris);
          } else {
            Alert.alert('Pick at least 3 images');
          }
        }
      },
    );
  };

  return (
    <View style={{flex: 1, padding: 20}}>
      <Button title="Select 3–5 Photos" onPress={pickImages} />
      <FlatList
        data={images}
        horizontal
        renderItem={({item}) => (
          <Image
            source={{uri: item}}
            style={{width: 100, height: 100, margin: 10}}
          />
        )}
        keyExtractor={item => item}
      />
      {images.length >= 3 && (
        <Button
          title="Make Video"
          onPress={() => navigation.navigate('Slideshow', {images})}
        />
      )}
    </View>
  );
}
