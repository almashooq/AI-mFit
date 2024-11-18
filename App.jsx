import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import WelcomePage from "./pages/welcome";
import Login from "./pages/login";
import Work from './pages/work'

export default function App() {
  const [currentPage, setCurrentPage] = useState("Welcome");

  return (
    <View style={styles.container}>
      {currentPage === "Welcome" && (
        <WelcomePage
          navigateToLogin={() => setCurrentPage("Login")}
          navigateToWork={() => setCurrentPage("Work")} // Pass navigateToWork
        />
      )}
      {currentPage === "Login" && (
        <Login navigateToWelcome={() => setCurrentPage("Welcome")} />
      )}
      {currentPage === "Work" && (
        <Work navigateToWelcome={() => setCurrentPage("Welcome")} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});




/*import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Button } from 'react-native';
import WebView from 'react-native-webview';
import { Camera, useCameraPermissions } from 'expo-camera';
import WelcomePage from './pages/welcome'
import Login from './pages/login';

const API_KEY = "dfa9144b-df2c-4ba2-b2ba-fe94be6e8d6e";
const POSETRACKER_API = "https://app.posetracker.com/pose_tracker/tracking";
const { width, height } = Dimensions.get('window');

export default function App() {
  const [poseTrackerInfos, setCurrentPoseTrackerInfos] = useState();
  const [repsCounter, setRepsCounter] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const [showHomePage, setShowHomePage] = useState(true);
  const [currentPage, setCurrentPage] = useState('Welcome');


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

  if (showHomePage) {
    return (
      <View style={styles.container}>
        {currentPage === "Welcome" && (
          <WelcomePage navigateToLogin={() => setCurrentPage("Login")} />
        )}
        {currentPage === "Login" && (
          <Login navigateToWelcome={() => setCurrentPage("Welcome")} />
        )}
        <Button title="Start Pose Tracker" onPress={() => setShowHomePage(false)} />
      </View>
    );
  }

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
      <Button title="Back to Home" onPress={() => setShowHomePage(true)} />
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
*/