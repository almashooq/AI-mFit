import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import logo from '../assets/logo.png'

const Reset = ({navigateToWelcome}) => {
    return(
        <SafeAreaView style={[styles.container]}>
          <View style={styles.bubble} />

          {/*header*/}
          <View style={styles.header}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>CHANGE PASSWORD</Text>
          </View>

          <View style={styles.contentContainer}>
            {/*form*/} 
            <View style={styles.form}>
            <Text style={styles.subtitle}>Enter your email address and we will send you a pasword reset link</Text>
              <View style={styles.inputContainer}>
                <TextInput 
                  style={styles.input} 
                  placeholder="Email" 
                  placeholderTextColor="#999" />
              </View>
            </View>

            {/*Resset button*/}
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>RESET</Text>
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
      marginTop: 100,
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




export default Reset;