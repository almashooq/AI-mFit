import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import WelcomePage from "./pages/welcome";
import Login from "./pages/login";
import Work from "./pages/work";
import Reset from "./pages/reset";
import SignUp from './pages/SignUp';
import PreWorkout from './pages/PreWorkout';

export default function App() {
  const [currentPage, setCurrentPage] = useState("Welcome");


  return (
    <View style={styles.container}>
      {currentPage === "Welcome" && (
        <WelcomePage
          navigateToLogin={() => setCurrentPage("Login")}
          navigateToPreWorkout={() => setCurrentPage("PreWorkout")}
        />
      )}
      {currentPage === "PreWorkout" && (
        <PreWorkout 
        navigateToWork={() => setCurrentPage("Work")}
        navigateToWelcome={() => setCurrentPage("Welcome")}
        />
      )}
      {currentPage === "Login" && (

        <Login 
          navigateToWelcome={() => setCurrentPage("Welcome")} 
          navigateToReset={() => setCurrentPage("Reset")}
          navigateToSignUp = {()=> setCurrentPage("SignUp")} 
        />
      )}
      {currentPage === "Work" && (
        <Work navigateToWelcome={() => setCurrentPage("Welcome")} />
      )}
      {currentPage === "Reset" && (
        <Reset navigateToLogin={() => setCurrentPage("Login")} />
      )}
      {currentPage === "SignUp" && (
        <SignUp navigateToLogin={() => setCurrentPage("Login")}/>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

