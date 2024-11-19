import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import logo from '../assets/logo.png'

const Login = ({navigateToWelcome , navigateToSignUp, navigateToReset}) => {
    return(
        <SafeAreaView style={[styles.container]}>
          <View style={styles.bubble} />

          {/*header*/}
          <View style={styles.header}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>LOG IN</Text>
          </View>

          <View style={styles.contentContainer}>
            {/*form*/} 
            <View style={styles.form}>
            <Text style={styles.subtitle}>ENTER YOUR CREDENTIAL TO LOGIN</Text>
              <View style={styles.inputContainer}>
                <TextInput 
                  style={styles.input} 
                  placeholder="Username/Email" 
                  placeholderTextColor="#999" />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry
                />            
              </View>
            </View>

            {/*login button*/}
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>LOG IN</Text>
            </TouchableOpacity>

            {/* Links */}
            <View style={styles.linksContainer}> 
                {/* Reset */}
                <Text style={styles.linkText}>
                  Forgot your password? 
                  <TouchableOpacity onPress={navigateToReset}>
                    <Text style={styles.link}>Reset Password</Text>
                  </TouchableOpacity>
                </Text>
                {/* Register */}
                <Text style={styles.linkText}>
                  Not a member yet? 
                  <TouchableOpacity style={styles.linkText} onPress={navigateToSignUp}>
                    <Text style={styles.link}>Register Now</Text>
                  </TouchableOpacity>
                </Text>
            </View>

            {/* Back to Welcome Button */}
            <TouchableOpacity onPress={navigateToWelcome} style={styles.backButton}>
              <Text style={styles.backButtonText}>Back to Welcome</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#797979',
    },
    contentContainer: {
      paddingTop: 100,
    },
    header: {
      alignItems: 'center',
      position: "absolute",
      top: 150,
    },
    logo: {
      width: 200,
      height: 100,
    },
    title: {
      fontSize: 34,
      fontWeight: 'bold',
      color: 'white',
      marginTop: 50,
      marginBottom: 50,
    },
    subtitle: {
      fontSize: 19,
      paddingBottom: 40,
      color: 'black',
      textAlign: 'center',
      fontWeight: 'bold'
    },
    form: {
      marginTop: 20,
      marginRight: 40,
      marginLeft: 40,
    },
    inputContainer: {
      backgroundColor: '#fff',
      borderRadius: 25,
      marginBottom: 15,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: '#D32F2F',
      marginRight: 2,
      marginLeft: 2,
    },
    input: {
      height: 50,
      fontSize: 16,
    },
    button: {
      backgroundColor: '#D32F2F',
      borderRadius: 25,
      paddingVertical: 15,
      alignItems: 'center',
      marginTop: 8,
      marginHorizontal: 120,
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    linksContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
    linkText: {
      color: '#666',
      marginBottom: 5,
    },
    link: {
      color: '#2979FF',
      fontWeight: 'bold',
    },
    backButton: {
      marginTop: 30,
      alignItems: 'center',
    },
    backButtonText: {
      color: '#2979FF',
      fontSize: 16,
    },
    bubble: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '65%',
      backgroundColor: '#ffffff',
      borderTopLeftRadius: 300,
      borderTopRightRadius: 300,
      zIndex: -1,
    },
  });




export default Login;


