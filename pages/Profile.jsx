import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView, Image, TouchableOpacity, TextInput } from 'react-native';
import logo from '../assets/logo.png';
import Profile_pic from '../assets/dummyProfile.png';
import back from '../assets/arrow.png';

const Profile = ({navigateToHome}) => {
    const API_URL = "http://172.20.10.6:8500/users";
    const user = "test"
    const [data, setData] = useState([]);
    
    const fetchData = async () => {
        try {
            const response = await fetch(`${API_URL}?username=${user}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const result = await response.json();
            if (result.length > 0) {
                setData(result[0]); // Assuming result is an array of users, take the first match
            } else {
                Alert.alert('Error', 'User not found');
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Unable to fetch data. Please try again later.');
        }
    };

    useEffect(() => {
        fetchData();
      }, []);

    return (
        <SafeAreaView style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backArrow} onPress={navigateToHome}>
                <Image source={back} style={styles.backIcon} />
            </TouchableOpacity>
            <View style={styles.header}>
                <Image source={logo} style={styles.logo} />
                <Image source={Profile_pic} style={styles.profile} />
                {data ? (
                    <>
                        <Text style={styles.title}>{data.username}</Text>
                        <View style={styles.info}>
                            <Text style={styles.input}>{data.age} years old</Text>
                            <Text style={styles.input}>{data.height} cm</Text>
                            <Text style={styles.input}>{data.weight} kg</Text>
                        </View>
                    </>
                ) : (
                    <Text style={styles.loadingText}>Loading user information...</Text>
                )}
                {/* <Text style={styles.title}>HI USERNAME</Text>
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
                </View> */}
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
        width: 300,
        height: 50,
        borderWidth: 1,
        borderColor: '#D32F2F',
        borderRadius: 25,
        marginBottom: 20,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#fff',
        textAlign: "center",
        paddingTop:10,
    },
    backArrow: {
      position: "absolute",
      paddingTop: 50,
      paddingLeft: 20,
      top: 0,
      left: 0,
    },
    loadingText: {
        fontSize: 18,
        color: '#fff',
        marginTop: 20,
    },
});

export default Profile;
