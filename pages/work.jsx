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
  const [poseTrackerInfos, setPoseTrackerInfos] = useState(null);
  const [repsCounter, setRepsCounter] = useState(0);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);


  const posetracker_url = `${POSETRACKER_API}?token=${API_KEY}&width=${width}&height=${height}&isMobile=true`;

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


  const webViewCallback = (data) => {
    if (data?.type === 'counter') {
      setRepsCounter(data.current_count);
    } else {
      setPoseTrackerInfos(data);
      console.log('Received pose tracker info:', data);
    }
  };

  const onMessage = (event) => {
    try {
      const parsedData = JSON.parse(event.nativeEvent.data);
      console.log('Parsed data from WebView:', parsedData);
      webViewCallback(parsedData);
    } catch (error) {
      console.error('Error processing message from WebView:', error);
    }
  };


  return (
    <View style={styles.container}>
      {/*info display */}
        <View style={styles.infoContainer}>
          <Image source={logo} style={styles.logo} />
          <Text>Status : {!poseTrackerInfos ? "loading AI..." : "AI Running"}</Text>
          <Text>Counter: {repsCounter}</Text>
          {poseTrackerInfos && (
          <>
            <Text>Placement ready: {poseTrackerInfos.ready ? "true" : "false"} </Text>
            {poseTrackerInfos.ready === false && (
              <Text>Placement info: Move {poseTrackerInfos?.postureDirection}</Text>
            )}
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


      {/* webview component */}
      <View style={styles.webViewContainer}>
        <WebView
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{ uri: posetracker_url }}
          style={styles.webView}
          injectedJavaScript={jsBridge}
          onMessage={onMessage}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          mixedContentMode="compatibility"
          debuggingEnabled={true}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error:', nativeEvent);
          }}
          onLoadingError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView loading error:', nativeEvent);
          }}
        />
      </View>


      {/*back to home button */}
        <View style={styles.centeredContainer}>
          <TouchableOpacity onPress={navigateToWelcome} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
  
      {/*
      <View style={styles.infoContainer}>
        <Image source={logo} style={styles.logo} />
        <Text>Status: {poseTrackerInfos ? "AI Running" : "Loading AI..."}</Text>
        <Text>{repsCounter}</Text>
      </View>

      {poseTrackerInfos && poseTrackerInfos.ready === false ? (
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
        )}*/}



    </View>
  );
};


export default Work;

{/*
  
  
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

      <View style={styles.centeredContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={navigateToWelcome} style={styles.backButton}>
            <Text style={styles.backButtonText}>End</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log("backtowelcome")} style={styles.backButton}>
            <Text style={styles.backButtonText}>Pause</Text>
          </TouchableOpacity>
        </View>
      </View>





      {/*
    
      <View style={styles.centeredContainer}>
        <View style={styles.buttonContainer}>
{/*          <TouchableOpacity onPress={navigateToWelcome} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back to Welcome</Text>
          </TouchableOpacity>
*     <Text>Counter: {repsCounter}</Text>
        </View>
      </View>



      




      <View style={{alignItems: 'center'}}>
        <Button title="Back to Welcome" onPress={navigateToWelcome} style={styles.buttonContainer}/>
        <Text style={styles.buttonContainer}>Counter: {repsCounter}</Text>
        <Text style={styles.buttonContainer}>Counter: {repsCounter}</Text>
      </View>
      *
      








    </View>
  );
}
*/}








const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    flexDirection: 'column',
  },
  webViewContainer: {
    flex: 1,
    //zIndex: 1,
  },
  webView: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  centeredContainer: {
    justifyContent: 'center', //vertically center
    alignItems: 'center', //horizontally center
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },



  buttonOverlay: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    zIndex: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
      bottom: 0,
    flexDirection: 'raw',
    justifyContent: 'space-around',
  },
  endButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
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
  pauseButton: {
    backgroundColor: 'gray',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 90,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
