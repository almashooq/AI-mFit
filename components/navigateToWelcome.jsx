import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import WelcomePage from '../pages/welcome';
import Login from "../pages/login";

export default function App() {
  const [currentPage, setCurrentPage] = useState("Welcome");

  return (
    <View style={styles.container}>
      {currentPage === "Welcome" && (
        <WelcomePage navigateToLogin={() => setCurrentPage("Login")} />
      )}
      {currentPage === "Login" && (
        <Login navigateToWelcome={() => setCurrentPage("Welcome")} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});