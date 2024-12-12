import { View, Text, StyleSheet, Button, SafeAreaView, Image, TextInput, TouchableOpacity } from 'react-native';
import logo from '../assets/logo.png';
import Profile_pic from '../assets/dummyProfile.png';


const Home = ({navigateToProfile})=> {
    return(
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Home page</Text>
        <TouchableOpacity onPress={navigateToProfile}>
        <Image source={Profile_pic} style={styles.profile} />
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
  },
  title:{
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    fontWeight: 'bold',
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
},
});


export default Home;