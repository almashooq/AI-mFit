import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import logo from '../assets/logo.png';

const exercises = [
  { id: 1, name: 'PLANKS', image: require('../assets/logo.png') },
  { id: 2, name: 'SQUAT', image: require('../assets/logo.png') },
  { id: 3, name: 'PUSH UPS', image: require('../assets/logo.png') },
  { id: 4, name: 'BURPEES', image: require('../assets/logo.png') },
  { id: 5, name: 'CRUNCHES', image: require('../assets/logo.png') },
  { id: 6, name: 'LUNGES', image: require('../assets/logo.png') },
];

const PreWorkout = ({ navigateToWelcome, navigateToWork }) => {
  return (
    <SafeAreaView style={styles.container}>

      <TouchableOpacity onPress={navigateToWelcome} style={styles.backButton}>
        <Text style={styles.backText}>BACK</Text>
      </TouchableOpacity>


      <Image source={logo} style={styles.logo} />


      <View style={styles.grid}>
        {exercises.map((exercise) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <Image source={exercise.image} style={styles.exerciseImage} />
            <Text style={styles.exerciseText}>{exercise.name}</Text>
          </View>
        ))}
      </View>


      <TouchableOpacity style={styles.signUpButton} onPress={navigateToWork}>
        <Text style={styles.signUpButtonText}>NEXT</Text>
      </TouchableOpacity>


      <Text style={styles.warningText}>
        WARNING: THIS MODEL IS DESIGNED TO ONLY RECOGNIZE AND ASSIST WITH THESE WORKOUTS.
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#797979',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backText: {
    margin:20,
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  exerciseCard: {
    width: '43%',
    height: 150,
    marginLeft:10,
    marginRight:10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    borderWidth: 2,
    borderColor: '#D32F2F',
  },
  exerciseImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  exerciseText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  signUpButton: {
    width: '90%',
    height: 50,
    backgroundColor: '#D32F2F',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signUpButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  warningText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#FFF',
    marginTop: 10,
  },
});

export default PreWorkout;
