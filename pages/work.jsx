import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image } from 'react-native';
import WebView from 'react-native-webview';
import { Camera, useCameraPermissions } from 'expo-camera';
import { Button } from 'react-native';
import logo from '../assets/logo.png'


const API_KEY = "dfa9144b-df2c-4ba2-b2ba-fe94be6e8d6e";
const POSETRACKER_API = "https://app.posetracker.com/pose_tracker/tracking";
const { width, height } = Dimensions.get('window');

const Work = ({ navigateToWelcome }) => {
    const [permission, requestPermission] = useCameraPermissions();
  
    useEffect(() => {
      if (!permission?.granted) {
        requestPermission();
      }
    }, []);
  
    const posetracker_url = `${POSETRACKER_API}?token=${API_KEY}&width=${width}&height=${height}&isMobile=true`;
  
    return (
      <View style={styles.container}>
        {/* webview component */}
        <View style={styles.webViewContainer}>
          <WebView
            javaScriptEnabled={true}
            domStorageEnabled={true}
            source={{ uri: posetracker_url }}
            style={styles.webView}
          />
        </View>
        
        <View style={styles.buttonOverlay}>
          <Button title="Back to Welcome" onPress={navigateToWelcome} />
        </View>
        <View style={styles.overlayContainer} pointerEvents="box-none">
          <TouchableOpacity onPress={navigateToWelcome} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back to Welcome</Text>
          </TouchableOpacity>
        </View>
      </View>
      
    );
  };


export default function App() {
  const [poseTrackerInfos, setCurrentPoseTrackerInfos] = useState();
  const [repsCounter, setRepsCounter] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const exercise = "squat";
  const difficulty = "easy";
  const skeleton = true;

  const posetracker_url = `${POSETRACKER_API}?token=${API_KEY}&exercise=${exercise}&difficulty=${difficulty}&width=${width}&height=${height}&isMobile=${true}`;

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
      const parsedData = JSON.parse(event.nativeEvent.data);
      console.log('Parsed data:', parsedData);
  
      // Check for keypoints
      if (parsedData.keypoints) {
        parsedData.keypoints.forEach((keypoint) => {
          console.log(`Keypoint: ${keypoint.name}, X: ${keypoint.x}, Y: ${keypoint.y}, Confidence: ${keypoint.confidence}`);
        });
      }
  
      webViewCallback(parsedData);
    } catch (error) {
      console.error('Error processing message:', error);
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
        <Image source={logo} style={styles.logo} />
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
        {poseTrackerInfos?.keypoints && (
  <View>
    <Text>Keypoints:</Text>
    {poseTrackerInfos.keypoints.map((keypoint, index) => (
      <Text key={index}>
        {keypoint.name}: ({(keypoint.x * width).toFixed(2)}, {(keypoint.y * height).toFixed(2)}) - Confidence: {keypoint.confidence.toFixed(2)}
      </Text>
    ))}
  </View>
)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    flexDirection: 'column',
  },
  webViewContainer: {
    flex: 1,
    zIndex: 1,
  },
  webView: {
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  infoContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    paddingBottom: 20,
    paddingTop: 1,
  },
  buttonOverlay: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  backButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logo: {
    width: 200,
    height: 90,
  },
});
