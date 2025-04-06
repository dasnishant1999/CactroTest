import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Animated,
  Dimensions,
  Alert,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import RecordScreen, { RecordingResult } from 'react-native-record-screen';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

const {width, height} = Dimensions.get('window');

export default function SlideshowScreen({route, navigation}) {
  const {images} = route.params;
  const [current, setCurrent] = useState(0);
  const [videoUri, setVideoUri] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  console.log(videoUri);

  useEffect(() => {
    startRecording();
    playMusic();
    animateNext(0);
  }, []);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const result = await request(
        Platform.Version >= 33
          ? PERMISSIONS.ANDROID.READ_MEDIA_VIDEO
          : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      );
      console.log(result);

      return result === RESULTS.GRANTED;
    }
    return true;
  };

  const playMusic = () => {
    const bg = new Sound('../assets/sixDays.mp3', Sound.MAIN_BUNDLE, err => {
      if (!err) {
        bg.play();
      }
    });
  };

  const startRecording = async () => {
    const res = RecordScreen.startRecording({ mic: false }).catch((error) => console.error(error));
    if (res === RecordingResult.PermissionError) {
      // user denies access
      console.log("startRecording", res)
    }
  };

  const stopRecording = async () => {
    const res = await RecordScreen.stopRecording().catch((error) =>
      console.warn(error)
    );
    console.log(res);
    if (res.status === 'success') {
      setVideoUri(res?.result?.outputURL);
      Alert.alert('Recording Complete', 'You can now download the video.');
    }
  };

  const animateNext = index => {
    if (index >= images.length) {
      stopRecording();
      return;
    }

    fadeAnim.setValue(0);
    setCurrent(index);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => animateNext(index + 1), 2000);
    });
  };

  const handleDownload = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission denied', 'Cannot save video without permission');
      return;
    }

    if (!videoUri) return;

    const fileName = `slideshow_${Date.now()}.mp4`;
    const dest = `${RNFS.DownloadDirectoryPath}/${fileName}`;

    try {
      await RNFS.copyFile(videoUri, dest);
      Alert.alert('Downloaded!', `Saved to: ${dest}`);
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Unable to save the video');
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{alignSelf: 'center'}}>
        <Animated.Image
          source={{uri: images[current]}}
          style={{
            width: width - 40,
            height: height - 100,
            opacity: fadeAnim,
            resizeMode: 'contain',
          }}
        />
      </View>

      {videoUri !== '' && (
        <TouchableOpacity
          onPress={handleDownload}
          style={{
            position: 'absolute',
            bottom: 40,
            alignSelf: 'center',
            backgroundColor: '#6495ED',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
          }}>
          <Text style={{fontWeight: 'bold', color: '#fff'}}>
            Download Video
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
