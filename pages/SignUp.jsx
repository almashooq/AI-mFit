import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, Image, TextInput, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import logo from '../assets/logo.png';
import back from '../assets/arrow.png'

const SignUp = ({navigateToLogin}) => {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
          {/*Back*/}
          <TouchableOpacity style={styles.backArrow} onPress={navigateToLogin}>
            <Image source={back}/>
          </TouchableOpacity>

      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>SIGN UP</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Create Your Account</Text>
        <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#999" />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999" />
        <TextInput style={styles.input} placeholder="Height (cm)" placeholderTextColor="#999" />
        <TextInput style={styles.input} placeholder="Weight (kg)" placeholderTextColor="#999" />
        <TextInput style={styles.input} placeholder="Gender" placeholderTextColor="#999" />
        <TextInput style={styles.input} placeholder="Age" placeholderTextColor="#999" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#999" />
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadButtonText}>Add Profile Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUpButton}>
          <Text style={styles.signUpButtonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#797979',
  },
  header: {
    alignItems: 'center',
    marginTop: 50,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  form: {
    marginTop: 40,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingVertical: 30,
    alignItems: 'center',
    zIndex:-1,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    height: 46,
    borderWidth: 1,
    borderColor:'#D32F2F',
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  uploadButton: {
    width: '90%',
    height: 50,
    backgroundColor: '#FFC0CB',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpButton: {
    width: '90%',
    height: 50,
    backgroundColor: '#D32F2F',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: '#999',
  },
  loginText: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
    backArrow: {
        position: "absolute",
        paddingTop: 50,
        paddingLeft: 20,
        top: 0,
        left: 0,
    }
});

export default SignUp;
