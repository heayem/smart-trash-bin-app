import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  View,
  ActivityIndicator,
} from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = () => {
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigate to the next screen or show a success message here
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      if (error.code === "auth/invalid-email") {
        setErrorMessage("The email address is badly formatted.");
      } else if (error.code === "auth/user-not-found") {
        setErrorMessage("No user found with this email address.");
      } else if (error.code === "auth/wrong-password") {
        setErrorMessage("Incorrect password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/bg/login_bg.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.innerContainer}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          style={styles.inputStyle}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          style={styles.inputStyle}
        />
        {errorMessage && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.btnLogin}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.btnText}>Login</Text>
          {loading && <ActivityIndicator size="small" color="#FFF" />}
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  inputStyle: {
    marginBottom: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    width: "80%",
    backgroundColor: "#fff",
  },
  errorContainer: {
    marginBottom: 10,
    paddingHorizontal: 10,
    padding: 10,
    width: "80%",
  },
  errorText: {
    color: "#f90017",
    fontSize: 16,
  },
  btnLogin: {
    backgroundColor: "#275efc",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row',
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    width: "80%",
  },
  btnText: {
    color: "white",
    fontSize: 16,
  },
});

export default LoginScreen;
