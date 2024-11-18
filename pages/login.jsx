import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import logo from '../assets/logo.png'

const Login = ({navigateToWelcome}) => {
    return(
        <SafeAreaView style={{ flex:1, backgroundColor: '#e8ecf4'}}>
            {/*header*/}
            <View style={styles.header}>
                <Image
                    source={logo}
                    alt="Logo"
                    style={styles.headerImg}
                />

                <Text style={styles.title}>Sign in</Text>
                <Text style={styles.subtitle}>Welcome back!!</Text>
            </View>

            {/*form*/}
            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder="Username/Email" placeholderTextColor="#999" />
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
                <Text style={styles.linkText}>
                    Forgot your password? <Text style={styles.link}>Reset Password</Text>
                </Text>
                <Text style={styles.linkText}>
                    Not a member yet? <Text style={styles.link}>Register Now</Text>
                </Text>
            </View>

            {/* Back to Welcome Button */}
            <TouchableOpacity onPress={navigateToWelcome} style={styles.backButton}>
                <Text style={styles.backButtonText}>Back to Welcome</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#e8ecf4',
      paddingHorizontal: 20,
    },
    header: {
      alignItems: 'center',
      marginVertical: 20,
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
    },
    form: {
      marginTop: 30,
    },
    inputContainer: {
      backgroundColor: '#fff',
      borderRadius: 25,
      marginBottom: 15,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: '#D32F2F',
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
      marginTop: 20,
    },
    buttonText: {
      color: '#fff',
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
  });




export default Login;


