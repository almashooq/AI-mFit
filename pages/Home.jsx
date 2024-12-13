import { View, Text, StyleSheet, Button, SafeAreaView, Image, TextInput, TouchableOpacity } from 'react-native';
import logo from '../assets/logo.png';
import Profile_pic from '../assets/dummyProfile.png';



const Home = ({navigateToProfile, navigateToReport, navigateToPreWorkout})=> {
    return(
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Home page</Text>
        <TouchableOpacity onPress={navigateToProfile}>
            <Image source={Profile_pic} style={styles.profile} />
        </TouchableOpacity>
        <Text style={styles.texttext}>What are you up to?</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={navigateToPreWorkout}>
            <Text style={styles.buttonText}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={navigateToReport}>
            <Text style={styles.buttonText}>Check workouts reports</Text>
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
    alignItems: 'center',
  },
  title:{
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    marginTop: 20,
  },
  texttext: {
    fontSize: 31,
    color: '#fff',
  },
  buttonContainer: {
    marginLeft: 15,
    marginRight: 15,
  },
  button: {
    backgroundColor: '#D32F2F',
    borderRadius: 25,
    paddingVertical: 15,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 130,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: 'bold',
    textAlign: 'center',
  },

});


export default Home;