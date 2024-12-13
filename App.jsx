import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import WelcomePage from "./pages/welcome";
import Login from "./pages/login";
import Work from "./pages/work";
import Reset from "./pages/reset";
import SignUp from './pages/SignUp';
import PreWorkout from './pages/PreWorkout';
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Report from "./pages/Report";

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
          navigateToHome={() => setCurrentPage("Home")}
        />
      )}
      {currentPage === "Work" && (
        <Work navigateToWelcome={() => setCurrentPage("Welcome")} />
      )}
      {currentPage === "Reset" && (
        <Reset navigateToLogin={() => setCurrentPage("Login")} />
      )}
      {currentPage === "SignUp" && (
        <SignUp 
          navigateToLogin={() => setCurrentPage("Login")}
          navigateToHome={() => setCurrentPage("Home")}
        />
      )}
       {currentPage === "Profile" && (
        <Profile 
        navigateToHome={() => setCurrentPage("Home")}
        />
      )}
       {currentPage === "Home" && (
        <Home 
        navigateToReport={() => setCurrentPage("Report")}
        navigateToPreWorkout={() => setCurrentPage("PreWorkout")}
        />
      )}
      {currentPage === "Report" && (
        <Report 
        navigateToReport={() => setCurrentPage("Report")}
        navigateToPreWorkout={() => setCurrentPage("PreWorkout")}
        navigateToHome={() => setCurrentPage("Home")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

