import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const ProfileScreen = () => {
  const auth = getAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      navigation.navigate("Home");
    } catch (error) {
      setErrorMessage("An error occurred while signing out. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <FontAwesome5 name="user-circle" size={54} color="black" />
        </View>
        <Text style={styles.info}>{auth.currentUser?.email}</Text>

        {errorMessage && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.backtButton}
            onPress={handleBack}
            disabled={loading}
          >
            <Text style={styles.signOutButtonText}>Back</Text>
            {loading && <ActivityIndicator size="small" color="#FFF" />}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            disabled={loading}
          >
            <Text style={styles.signOutButtonText}>Sign Out</Text>
            {loading && <ActivityIndicator size="small" color="#FFF" />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  card: {
    width: "90%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    marginTop: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  btnContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
    marginBottom: 20,
  },

  iconContainer: {
    marginBottom: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  info: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
  },
  errorContainer: {
    marginBottom: 20,
  },
  errorText: {
    color: "#f90017",
    fontSize: 16,
  },
  backtButton: {
    backgroundColor: "#979393",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "50%",
    padding: 10,
    borderRadius: 5,
  },
  signOutButton: {
    backgroundColor: "#ff4d4d",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "50%",
    padding: 10,
    borderRadius: 5,
  },
  signOutButtonText: {
    color: "white",
    fontSize: 16,
    marginRight: 10,
  },
});

export default ProfileScreen;
