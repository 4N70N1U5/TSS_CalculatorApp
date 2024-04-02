import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Button,
  Switch,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { StackActions } from "@react-navigation/native";
import { doc, setDoc } from "firebase/firestore";
import { scheduleNotification } from "../../usePushNotifications";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();

  const switchToRegister = () => {
    navigation.dispatch(StackActions.replace("Sign up"));
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.reset({
          index: 0,
          routes: [{ name: "TabNavigator" as never }],
        });
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      scheduleNotification();
      console.log(response.user.email + " is logged in.");
    } catch (error) {
      alert("Invalid email or password.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={email}
        placeholder="Email"
        placeholderTextColor="grey"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        value={password}
        placeholder="Password"
        placeholderTextColor="grey"
        autoCapitalize="none"
        onChangeText={(text) => setPassword(text)}
      />

      <TouchableOpacity style={styles.inputButton} onPress={() => signIn()}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>

      {loading ? <ActivityIndicator size="large" style={styles.loadingIcon} /> : <></>}

      <Text style={styles.bottomText}>Don't have an account yet?{"\n"}
        <Text style={styles.pageLink} onPress={() => switchToRegister()}>Sign up</Text> now!
      </Text>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginHorizontal: 20,
    flex: 1,
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderRadius: 4,
    padding: 10,
    fontSize: 17,
    backgroundColor: "white",
  },
  inputButton: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "black",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
  bottomText: {
    fontSize: 17,
    textAlign: "center",
    color: "grey",
    alignSelf: "center",
    position: "absolute",
    bottom: 60,
  },
  loadingIcon: {
    alignSelf: "center",
    position: "absolute",
    bottom: 200,
  },
  pageLink: {
    textDecorationLine: "underline",
  },
});
