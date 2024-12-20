import React, { useState, useEffect , useRef} from 'react';
import { StyleSheet, Image, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import WebView from 'react-native-webview';
import {useCameraPermissions , useMicrophonePermissions , CameraView } from 'expo-camera';
import { fetch } from 'expo/fetch';
import back from '../assets/arrow.png'

const API_KEY = "dfa9144b-df2c-4ba2-b2ba-fe94be6e8d6e";
const POSETRACKER_API = "https://app.posetracker.com/pose_tracker/tracking";
const { width, height } = Dimensions.get('window');

export default function Work({navigateToWelcome}) {
  const [poseTrackerInfos, setCurrentPoseTrackerInfos] = useState();
  const [repsCounter, setRepsCounter] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect( () => {
    const handlePermission = async () => {
    if (!permission?.granted) {
      requestPermission();
    }
    };
    handlePermission();
  }, []);


  const sendToServer = async (data) => {
    try {
      const response = await fetch("https://9c2d-94-129-158-103.ngrok-free.app", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('Server response:', result);
    } catch (error) {
      console.error('Error sending frames:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      sendToServer(poseTrackerInfos);
    }, 3000);

    return () => clearInterval(interval);
  }, [poseTrackerInfos]); 

  const exercise = "squat";
  const difficulty = "easy";
  const skeleton = true;

  const posetracker_url = `${POSETRACKER_API}?token=${API_KEY}&exercise=${exercise}&difficulty=${difficulty}&width=${width}&height=${height}&isMobile=${true}&keypoints=${true}&screenshots=true`;

  // Bridge JavaScript BETWEEN POSETRACKER & YOUR APP
  const jsBridge = `
    window.addEventListener('message', function(event) {
      window.ReactNativeWebView.postMessage(JSON.stringify(event.data));
    });

    window.webViewCallback = function(data) {
      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    };

    const originalPostMessage = window.postMessage;
    window.postMessage = function(data) {
      window.ReactNativeWebView.postMessage(typeof data === 'string' ? data : JSON.stringify(data));
    };

    true; // Important for a correct injection
  `;

  const handleCounter = (count) => {
    setRepsCounter(count);
  };

  const handleInfos = (infos) => {
    setCurrentPoseTrackerInfos(infos);
    console.log('Received infos:', infos);
  };

  const webViewCallback = (info) => {
    if (info?.type === 'counter') {
      handleCounter(info.current_count);
    } else {
      handleInfos(info);
    }
  };

  const onMessage = (event) => {
    try {
      let parsedData;
      if (typeof event.nativeEvent.data === 'string') {
        parsedData = JSON.parse(event.nativeEvent.data);
      } else {
        parsedData = event.nativeEvent.data;
      }

      console.log('Parsed data:', parsedData);
      webViewCallback(parsedData);
    } catch (error) {
      console.error('Error processing message:', error);
      console.log('Problematic data:', event.nativeEvent.data);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        style={styles.webView}
        source={{ uri: posetracker_url }}
        originWhitelist={['*']}
        injectedJavaScript={jsBridge}
        onMessage={onMessage}
        // Activer le debug pour voir les logs WebView
        debuggingEnabled={true}
        // Permettre les communications mixtes HTTP/HTTPS si nécessaire
        mixedContentMode="compatibility"
        // Ajouter un gestionnaire d'erreurs
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error:', nativeEvent);
        }}
        // Ajouter un gestionnaire pour les erreurs de chargement
        onLoadingError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView loading error:', nativeEvent);
        }}
      />
      <View style={styles.infoContainer}>
        {/*Back*/}
        <TouchableOpacity style={styles.backArrow} onPress={navigateToWelcome}>
          <Image source={back}/>
        </TouchableOpacity>
        <Text>Status : {!poseTrackerInfos ? "loading AI..." : "AI Running"}</Text>
        <Text>Info type : {!poseTrackerInfos ? "loading AI..." : poseTrackerInfos.type}</Text>
        <Text>Counter: {repsCounter}</Text>
        {poseTrackerInfos?.ready === false ? (
          <>
            <Text>Placement ready: false</Text>
            <Text>Placement info: Move {poseTrackerInfos?.postureDirection}</Text>
          </>
        ) : (
          <>
            <Text>Placement ready: true</Text>
            <Text>Placement info: You can start doing squats 🏋️</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  webView: {
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  infoContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
  },
  backArrow: {
    position: "absolute",
    paddingTop: 10,
    paddingLeft: 20,
    top: 0,
    left: 0,
  }
});