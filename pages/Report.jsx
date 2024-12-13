import { View, Text, StyleSheet, Button, SafeAreaView, Image, TextInput, TouchableOpacity } from 'react-native';
import logo from '../assets/logo.png';
import Profile_pic from '../assets/dummyProfile.png';
import back from '../assets/arrow.png';



const Report = ({navigateToHome, navigateToReport, navigateToProfile})=> {
    return(
        <SafeAreaView style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backArrow} onPress={navigateToHome}>
                <Image source={back} style={styles.backIcon} />
            </TouchableOpacity>

            <View style={styles.header}>
                <Image source={logo} style={styles.logo} />
                <TouchableOpacity onPress={navigateToProfile}>
                    <Image source={Profile_pic} style={styles.profile} />
                </TouchableOpacity>
                <Text style={styles.texttext}>Recent Workouts</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={navigateToReport}>
                    <Text style={styles.buttonText}>Workouts:</Text>
                    <Text style={styles.buttonText}>Overall feedback:</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Workouts:</Text>
                    <Text style={styles.buttonText}>Overall feedback:</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Workouts:</Text>
                    <Text style={styles.buttonText}>Overall feedback:</Text>
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
  profile: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    marginTop: 20,
  },
  texttext: {
    fontSize: 31,
    fontWeight: "bold",
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
    alignItems: 'left',
    height: 130,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 27,
    marginLeft: 30,
  },
  backArrow: {
    position: "absolute",
    paddingTop: 50,
    paddingLeft: 20,
    top: 0,
    left: 0,
  },


});


export default Report;