import React, { useState, useEffect , useRef} from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import WebView from 'react-native-webview';
import {useCameraPermissions , useMicrophonePermissions , CameraView } from 'expo-camera';
import { fetch } from 'expo/fetch';

const API_KEY = "dfa9144b-df2c-4ba2-b2ba-fe94be6e8d6e";
const POSETRACKER_API = "https://app.posetracker.com/pose_tracker/tracking";
const { width, height } = Dimensions.get('window');

export default function App() {
  const [poseTrackerInfos, setCurrentPoseTrackerInfos] = useState();
  const [repsCounter, setRepsCounter] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const frameBuffer = useRef([]);

  useEffect( () => {
    const handlePermission = async () => {
    if (!permission?.granted) {
      requestPermission();
    }
    // if (permission?.granted) {
    //   if (cameraRef.current) {
    //     try {
    //       const photo = await cameraRef.current.takePictureAsync({ base64: true });
    //       frameBuffer.current.push(photo.base64);
    //     } catch (error) {
    //       console.error('Error capturing frame:', error);
    //     }
    //   }
    // }
    };
    handlePermission();
  }, []);


  // const sendFramesToServer = async (frames) => {
  //   try {
  //     const response = await fetch("https://3314-37-231-254-67.ngrok-free.app", {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ "Aida":"Aida" }),
  //     });

  //     const result = await response.json();
  //     console.log('Server response:', result);
  //   } catch (error) {
  //     console.error('Error sending frames:', error);
  //   }
  // };

//  useEffect(() => {
//   const captureInterval = setInterval(async () => {
//     if (cameraRef.current) {
//       try {
//         const photo = await cameraRef.current.takePictureAsync({ base64: true });
//         frameBuffer.current.push(photo.base64);

//         // If buffer contains 30 frames, send them to the server
//         if (frameBuffer.current.length >= 30) {
//           const framesToSend = [...frameBuffer.current];
//           frameBuffer.current = []; // Clear the buffer
//           sendFramesToServer(framesToSend);
//         }
//       } catch (error) {
//         console.error('Error capturing frame:', error);
//       }
//     }
//   }, 1000); 

  // return () => clearInterval(captureInterval); 
  // },[frameBuffer]);

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
});