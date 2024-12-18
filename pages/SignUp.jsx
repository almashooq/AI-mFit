import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, Image, TextInput, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import logo from '../assets/logo.png';
import back from '../assets/arrow.png'

const email_regex =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// should start with a letter...letters/numbers/underscore allowed...length: 2 to 23
const name_regex = /^[a-zA-Z][a-zA-Z0-9-_]{2,23}$/;
//should have letters and numbers...length: 8 to 28
const password_regex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,24}$/;

const SignUp = ({navigateToLogin, navigateToHome}) => {
  //email
  const [email,setEmail]= useState('');
  const [validEmail, setvEmail]= useState(false);
  useEffect ( ()=>{
    setvEmail ( email_regex.test(email) )
  }, [email] )

  //username
  const [user, setUser]= useState('');
  const [validName, setvName]= useState(false);
  const [nFocus, setnFocus]= useState(false);
  useEffect ( ()=>{
    setvName ( name_regex.test(user) )
  }, [user] )

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

  //height
  const [height,setHeight]= useState('');
  const [validHeight, setvHeight]= useState(false);
  
  //height
  const [weight,setWeight]= useState('');
  const [validWeight, setvWeight]= useState(false);

  //age
  const [age,setAge]= useState('');

  //gender
  const [gender,setGender]= useState('');

  //image
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

  const handleSignup = () => {
    //upon success
    navigateToHome(); 
  };

  return (
    <SafeAreaView style={styles.container}>
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
        {/* username */}
        <TextInput style={styles.input} 
          placeholder="Username" placeholderTextColor="#999" 
          value={pwd}
          onChangeText={(text) => setUser(text)}
          onFocus={()=>setnFocus(true)}
          onBlur={()=>setnFocus(false)}
        />
        {/* email */}
        <TextInput style={styles.input} 
          placeholder="Email" placeholderTextColor="#999"
          value={pwd}
          onChangeText={(text) => setEmail(text)}
        />
        {/* height */}
        <TextInput style={styles.input} 
          placeholder="Height (cm)" placeholderTextColor="#999"
          value={height}
          onChangeText={(text) => setHeight(text)} 
        />
        {/* weight */}
        <TextInput style={styles.input} 
          placeholder="Weight (kg)" placeholderTextColor="#999"
          value={weight}
          onChangeText={(text) => setWeight(text)} 
        />
        {/* gender (drop menu) */}
        <TextInput style={styles.input}  
          placeholder="Gender" placeholderTextColor="#999" 

        />
        {/* age (drop menu) */}
        <TextInput style={styles.input} 
          placeholder="Age" placeholderTextColor="#999" 

        />
        {/* password */}
        <TextInput style={styles.input} 
          placeholder="Password" placeholderTextColor="#999" 
          secureTextEntry
          value={pwd}
          onChangeText={(text) => setPwd(text)}
          onFocus={()=>setpFocus(true)}
          onBlur={()=>setpFocus(false)}
        />
        {/* confirm password */}
        <TextInput style={styles.input} 
          placeholder="Confirm Password" placeholderTextColor="#999" 
          secureTextEntry
          value={cpwd}
          onChangeText={(text) => setcPwd(text)}
        />
        {/* image */}
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadButtonText}>Add Profile Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignup}>
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
}
});

export default SignUp;
