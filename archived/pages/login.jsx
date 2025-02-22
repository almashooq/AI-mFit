import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import logo from '../assets/logo.png'
import back from '../assets/arrow.png'

const Login = ({navigateToWelcome , navigateToSignUp, navigateToReset , navigateToHome}) => {
  const API_URL = "http://172.20.10.6:8500/users";
  const [user,setUser] = useState('');
  const [pwd,setPwd] = useState('');

  const handleLogin = async (event) => {
    if (!user || !pwd) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }
    event.preventDefault();
    try {
      // fetching data
      const responseN = await fetch(`${API_URL}?username=${user}&password=${pwd}`);
      const responseE = await fetch(`${API_URL}?email=${user}&password=${pwd}`);

      //invalidation error
      if (!responseN.ok && !responseE.ok) {
        Alert.alert('Error', 'Invalid username/email or password');
        return;
      }
      // storing data
      const dataN = await responseN.json().catch(() => null);
      const dataE = await responseE.json().catch(() => null);
      const data = (dataN && dataN.length > 0) ? dataN : dataE;
      //console.log(data)

      if (data && data.length > 0) {
        console.log('Logged in successfully:', data);
        navigateToHome();
      } else {
        Alert.alert('Error', 'No matching user found.');
      }

    } catch (err) {
      console.error('Error:', err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
    setPwd('');
  };
  
  return(
        <SafeAreaView style={[styles.container]}>
          <View style={styles.bubble} />

          {/*Back*/}
          <TouchableOpacity style={styles.backArrow} onPress={navigateToWelcome}>
            <Image source={back}/>
          </TouchableOpacity>

          {/*header*/}
          <View style={styles.header}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>Login</Text>
          </View>

          <View style={styles.contentContainer}>
            {/*form*/} 
            <View style={styles.form}>
            <Text style={styles.subtitle}>ENTER YOUR CREDENTIAL TO LOGIN</Text>
              <View style={styles.inputContainer}>
                <TextInput 
                  style={styles.input} 
                  placeholder="Username/Email" 
                  placeholderTextColor="#999" 
                  value={user}
                  onChangeText={(text) => setUser(text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={pwd}
                  onChangeText={(text) => setPwd(text)}
                />            
              </View>
            </View>

            {/*login button*/}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
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
            {/*  
            // Back to Welcome Button
            <TouchableOpacity onPress={navigateToWelcome} style={styles.backButton}>
              <Text style={styles.backButtonText}>Back to Welcome</Text>
            </TouchableOpacity>
            */}
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
      paddingTop: "50%",
    },
    header: {
      alignItems: 'center',
      position: "absolute",
      top: 100,
    },
    logo: {
      width: 200,
      height: 100,
    },
    title: {
      fontSize: 34,
      fontWeight: 'bold',
      color: 'white',
      marginTop: 20,
    },
    subtitle: {
      fontSize: 19,
      paddingBottom: 40,
      color: 'black',
      fontWeight: 'bold'
    },
    form: {
      marginTop: 20,
      marginRight: 40,
      marginLeft: 40,
    },
    inputContainer: {
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
      height: '70%',
      backgroundColor: '#ffffff',
      borderTopLeftRadius: 100,
      borderTopRightRadius: 100,
    },
    backArrow: {
        position: "absolute",
        paddingTop: 50,
        paddingLeft: 20,
        top: 0,
        left: 0,
    }
  });




export default Login;


