import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, TextInput } from 'react-native';
import logo from '../assets/logo.png';
import Profile_pic from '../assets/profile_page.png';
import back from '../assets/arrow.png';

const Profile = ({navigateToHome}) => {
    return (
        <SafeAreaView style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backArrow} onPress={navigateToHome}>
                <Image source={back} style={styles.backIcon} />
            </TouchableOpacity>
            <View style={styles.header}>
                <Image source={logo} style={styles.logo} />
                <Image source={Profile_pic} style={styles.profile} />
                <Text style={styles.title}>HI USERNAME</Text>
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Age"
                        placeholderTextColor="#999"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Height"
                        placeholderTextColor="#999"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Weight"
                        placeholderTextColor="#999"
                    />
                </View>
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
    },
    profile: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 30,
    },
    form: {
        width: '80%',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#D32F2F',
        borderRadius: 25,
        marginBottom: 20,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#fff',
    },
    backArrow: {
      position: "absolute",
      paddingTop: 50,
      paddingLeft: 20,
      top: 0,
      left: 0,
    },
   
});

export default Profile;
