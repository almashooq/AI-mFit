import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import logo from '../assets/logo.png'
import back from '../assets/arrow.png'

const email_regex =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const password_regex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,24}$/;

  const Reset = ({navigateToLogin}) => {
    const [view, setView] = useState("enterEmail");
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleEmailSubmit = () => {
      if (email) {
        setView("enterNewPassword");
      } else {
        alert("Please enter a valid email.");
      }
    };

    const handlePasswordSubmit = () => {
      if (newPassword === confirmPassword && newPassword) {
        setView("resetSuccess");
      } else {
        alert("Passwords do not match or are empty!");
      }
    };
    
    return(
        <SafeAreaView style={[styles.container]}>
          <View style={styles.bubble} />
        
        {view === "enterEmail" && (
        <>
          {/*Back*/}
          <TouchableOpacity style={styles.backArrow} onPress={navigateToLogin}>
            <Image source={back}/>
          </TouchableOpacity>
        </>
        )}

          {/*header*/}
          <View style={styles.header}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>RESET PASSWORD</Text>
          </View>
{/* ================================================================================= */}
          <View style={styles.contentContainer}>
            {/*EMAIL page*/} 
            {view === "enterEmail" && (
              <>
                {/*form*/} 
                <View style={styles.form}>
                <Text style={styles.subtitle}>Enter your email address and we will send you a pasword reset link</Text>
                  <View style={styles.inputContainer}>
                    <TextInput 
                      style={styles.input} 
                      placeholder="Email" 
                      placeholderTextColor="#999"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                </View>

                {/*send button*/}
                <TouchableOpacity style={styles.button} onPress={handleEmailSubmit}>
                  <Text style={styles.buttonText}>SEND</Text>
                </TouchableOpacity>
              </>
            
            )}
{/* ================================================================================= */}
            {/*RESET page*/} 
            {view === "enterNewPassword" && (
              <>
                {/*form*/} 
                <View style={styles.form}>
                  <Text style={styles.label}>ENTER NEW PASSWORD</Text>
                  <View style={styles.inputContainer}>
                    <TextInput 
                      style={styles.input} 
                      placeholder="New Password" 
                      secureTextEntry
                      placeholderTextColor="#999" 
                      value={newPassword}
                      onChangeText={setNewPassword}
                    />
                  </View>

                  <Text style={styles.label}>CONFIRM NEW PASSWORD</Text>
                  <View style={styles.inputContainer}>
                    <TextInput 
                      style={styles.input} 
                      placeholder="Confirm Password" 
                      secureTextEntry
                      placeholderTextColor="#999" 
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                  </View>
                </View>

                {/*Reset button*/}
                <TouchableOpacity style={styles.button} onPress={handlePasswordSubmit}>
                  <Text style={styles.buttonText}>RESET</Text>
                </TouchableOpacity>
              </>
            
            )}
{/* ================================================================================= */}
            {/*SUCCESS page*/} 
            {view === "resetSuccess" && (
              <>
                <Text style={styles.subtitle}>you SUCCESSFULLY reset your password</Text>
                {/*BACK TO LOGING button*/}
                <TouchableOpacity style={styles.button} onPress={navigateToLogin}>
                    <Text style={styles.buttonText}>BACK TO LOGIN PAGE</Text>
                  </TouchableOpacity>
              </>
            )}

          </View>
        </SafeAreaView>
    );
};

{/* ================================================================================= */}
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
      margin:5,
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
      zIndex: -1,
    },
    backArrow: {
        position: "absolute",
        paddingTop: 50,
        paddingLeft: 20,
        top: 0,
        left: 0,
    }
  });

export default Reset;