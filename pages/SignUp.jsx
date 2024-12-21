import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, KeyboardAvoidingView, Platform, View, Text, StyleSheet, Button, SafeAreaView, Image, TextInput, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import logo from '../assets/logo.png';
import back from '../assets/arrow.png';

const email_regex =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// should start with a letter...letters/numbers/underscore allowed...length: 2 to 23
const name_regex = /^[a-zA-Z][a-zA-Z0-9-_]{2,23}$/;
//should have letters and numbers...length: 8 to 28
const password_regex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,24}$/;

const SignUp = ({navigateToLogin, navigateToHome}) => {
  const API_URL = "http://172.20.10.6:8500/users";
// =============================================================
  //email
  const [email,setEmail]= useState('');
  const [validEmail, setvEmail]= useState(false);
  useEffect ( ()=>{
    setvEmail ( email_regex.test(email) )
  }, [email] )
// =============================================================
  //username
  const [name, setName]= useState('');
  const [validName, setvName]= useState(false);
  useEffect ( ()=>{
    setvName ( name_regex.test(name) )
  }, [name] )
// =============================================================
  //password
  const [pwd,setPwd]= useState('');
  const [validPwd, setvPwd]= useState(false);
  const [pFocus, setpFocus]= useState(false);
  //Confirm Password
  const [cpwd,setcPwd]= useState('');
  const [vcPwd, setvcPwd]= useState(false);

  useEffect ( ()=>{
    setvPwd ( password_regex.test(pwd) )
    setvcPwd ( pwd == cpwd )
  }, [pwd, cpwd] )
// =============================================================
  //height
  const [height,setHeight]= useState('');
  const [validHeight, setvHeight]= useState(false);
// ============================================================= 
  //height
  const [weight,setWeight]= useState('');
  const [validWeight, setvWeight]= useState(false);
// =============================================================
  //age
  const [age,setAge]= useState('');
// =============================================================
  //gender
  const [gender,setGender]= useState('');
// =============================================================
  //image
  const [image, setImage] = useState('dummyProfile.png');

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
// =============================================================
  const handleSignup = async (e) => {
    if (!name || !email || !pwd || !cpwd || !height || !weight || !gender || !age ) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    e.preventDefault();
    fetch(API_URL)
      .then ( (response) => response.json() )
      .then ( (users) => {
        const isNameTaken = users.some((user) => user.username === name);
        const isEmailTaken = users.some((user) => user.email === email);

        if (isNameTaken) {
          Alert.alert('Error', 'Username is already taken');
        } else if (isEmailTaken) {
          Alert.alert('Error', 'Email is already registered');
        } else {
          fetch(API_URL,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "username": name,
              "email": email,
              "password": pwd,
              "height": height,
              "weight": weight,
              "gender": gender,
              "age": age,
              "picture": image,
            }),
          })
          .then ( (response) => {
            if (response.ok) {
              navigateToHome(); 
              //Alert.alert('Success', 'User registered successfully!');
              setName('');
              setEmail('');
              setPwd('');
              setcPwd('');
              setHeight('');
              setWeight('');
              setGender('');
              setAge('');
              setImage('dummyProfile.png');
            } else {
              throw new Error ('Failed to register user');
            }
          })
          .catch ( (error) => {
            console.error(error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
          });
        }
      })
      .catch ( (error) => {
        console.error(error);
        Alert.alert('Error', 'Could not fetch users. Please try again.');
      });
  };
// =============================================================
  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}>
    <ScrollView>
    {/* <SafeAreaView style={styles.container}> */}
      <View style={styles.bubble} />
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
{/* ========================================================================== */}        
        {/* username */}
        <TextInput style={[styles.input, !validName && name ? styles.invalidInput : null]} 
          placeholder="Username" placeholderTextColor="#999" 
          value={name}
          onChangeText={(text) => setName(text)}
          autoCapitalize="none"
        />
        {!validName && name && (
        <Text style={styles.errorText}>
          Username must be 2 to 23 characters, begins with a letter, numbers and underscore are allowed.
        </Text>
        )}
{/* ========================================================================== */}
        {/* email */}
        <TextInput style={[styles.input, !validEmail && email ? styles.invalidInput : null]} 
          placeholder="Email" placeholderTextColor="#999"
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {!validEmail && email && (
        <Text style={styles.errorText}>Must be in an email format: email@example.com</Text>
        )}
{/* ========================================================================== */}
        {/* height */}
        <TextInput style={styles.input} 
          placeholder="Height (cm)" placeholderTextColor="#999"
          value={height}
          onChangeText={(text) => setHeight(text)} 
        />
{/* ========================================================================== */}        
        {/* weight */}
        <TextInput style={styles.input} 
          placeholder="Weight (kg)" placeholderTextColor="#999"
          value={weight}
          onChangeText={(text) => setWeight(text)} 
        />
{/* ========================================================================== */}        
        {/* gender (drop menu) */}
        <TextInput style={styles.input}  
          placeholder="Gender" placeholderTextColor="#999" 
          value={gender}
          onChangeText={(text) => setGender(text)}
        />
{/* ========================================================================== */}        
        {/* age (drop menu) */}
        <TextInput style={styles.input} 
          placeholder="Age" placeholderTextColor="#999" 
          value={age}
          onChangeText={(text) => setAge(text)}
        />
{/* ========================================================================== */}        
        {/* password */}
        <TextInput style={[styles.input, !validPwd && pwd ? styles.invalidInput : null]} 
          placeholder="Password" placeholderTextColor="#999" 
          secureTextEntry
          value={pwd}
          onChangeText={(text) => setPwd(text)}
          autoCapitalize="none"
        />
        {!validPwd && pwd && (
        <Text style={styles.errorText}>Password must be 8 to 24 characters, only letters and numbers allowed.</Text>
        )}
        {/* confirm password */}
        <TextInput style={[styles.input, !vcPwd && cpwd ? styles.invalidInput : null]} 
          placeholder="Confirm Password" placeholderTextColor="#999" 
          secureTextEntry
          value={cpwd}
          onChangeText={(text) => setcPwd(text)}
          autoCapitalize="none"
        />
        {!vcPwd && cpwd && (
        <Text style={styles.errorText}>Must match the first password input field.</Text>
        )}
{/* ========================================================================== */}        
        {/* image */}
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadButtonText}>Add Profile Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignup}>
          <Text style={styles.signUpButtonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    {/* </SafeAreaView> */}

    </ScrollView>
    </KeyboardAvoidingView>
  );
};
{/* ========================================================================== */}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#797979',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 200,
    height: 100,
   // marginBottom: 5,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
  },
  form: {
    marginTop: 10,
    paddingHorizontal: 20,
    flex: 1,
    // backgroundColor: '#fff',
    // borderTopLeftRadius: 50,
    // borderTopRightRadius: 50,
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
  bubble: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '80%',
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
  },
  invalidInput: {
    borderColor: 'red',
    borderWidth: 3,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});

export default SignUp;
