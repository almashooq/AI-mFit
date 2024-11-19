import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, Button } from "react-native";
import { Video } from 'expo-av';
import welcomeBG from "../assets/welcomeBG.mp4";
import logo from "../assets/logo.png";

const WelcomePage = ({ navigateToLogin, navigateToWork }) => {
  return (
    <View style={styles.container}>
      {/* Background Video */}
      <Video
        source={welcomeBG}
        style={styles.backgroundVideo}
        resizeMode="cover"
        shouldPlay
        isLooping
        isMuted
        rate={1.0}
        pointerEvents="none"
      />

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={navigateToWork}>
            <Text style={styles.buttonText}>TRY AI’MFIT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToLogin}>
            <Text style={styles.buttonText}>LOG IN</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',  
    },
    backgroundVideo: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    logoContainer: {
      position: "absolute",
      top: -5,
      alignSelf: "center",
      zIndex: 1,
    },
    logo: {
      width: 200,
      height: 200,
      marginBottom: 20,
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 60,
      width: '80%',
    },
    button: {
      backgroundColor: '#D32F2F',
      borderRadius: 25,
      paddingVertical: 15,
      marginVertical: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  
  export default WelcomePage;