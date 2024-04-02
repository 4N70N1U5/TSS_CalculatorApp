import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { StackActions } from "@react-navigation/native";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const PostRegistration = () => {
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [isDirect, setisDirect] = useState(true);

  const navigation = useNavigation();

  const handleSingOut = () => {
    FIREBASE_AUTH.signOut()
      .then(() => {
        console.log("Logged out!");
        navigation.reset({
          index: 0,
          routes: [{ name: "Landing" as never }],
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = async () => {
    const isIntegerInRange = (value, min, max) => {
      const intValue = parseInt(value, 10);
      return Number.isInteger(intValue) && intValue >= min && intValue <= max;
    };

    if (!isIntegerInRange(amount, 1, 100)) {
      alert("Amount of cigarettes should be between 1 and 100.");
    } else if (!isIntegerInRange(price, 1, 2147483647)) {
      alert(
        "Price of a pack should be between 1 and 2147483647 monetary units."
      );
    } else {
      try {
        const uid = FIREBASE_AUTH.currentUser?.uid;

        if (uid) {
          const userDocRef = doc(FIRESTORE_DB, "users", uid);

          await updateDoc(userDocRef, {
            amount: amount,
            price: price,
            direct: !isDirect,
            longestStreak: 0,
            startPlan: new Date(),
          });
          navigation.dispatch(StackActions.replace("TabNavigator"));
        }
      } catch (error) {
        console.error("Error setting Amount and Price", error);
      }
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  });

  const toggleMode = () => {
    setisDirect((prevMode) => !prevMode);
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.headerText}>Welcome to iQuit!</Text>
        <Text style={styles.regularText}>You have to complete your profile before you can use the app.</Text>
        <TextInput
          keyboardType="numeric"
          returnKeyType="done"
          value={amount}
          onChangeText={(text) => setAmount(text)}
          placeholder="Cigarettes in a day"
          placeholderTextColor="grey"
          style={styles.input}
        />
        <TextInput
          keyboardType="numeric"
          returnKeyType="done"
          value={price}
          onChangeText={(text) => setPrice(text)}
          placeholder="Price of a pack"
          placeholderTextColor="grey"
          style={styles.input}
        />
        <View style={styles.hStack}>
          <Text style={styles.inputText}>Do you want to quit gradually?</Text>
          <Switch
            value={isDirect}
            onValueChange={toggleMode}
          />
        </View>
        <TouchableOpacity style={styles.inputButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 110 }}>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleSingOut}>
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
  },
  hStack: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginVertical: 4,
    backgroundColor: "white",
    borderRadius: 4,
    padding: 10,
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
  headerText: {
    fontSize: 34,
    fontWeight: "normal",
    marginBottom: 20,
    textAlign: "center",
    alignSelf: "center",
  },
  regularText: {
    fontSize: 17,
    fontWeight: "normal",
    marginBottom: 20,
    textAlign: "center",
    alignSelf: "center",
  },
  inputText: {
    fontSize: 17,
    fontWeight: "normal",
    textAlign: "left",
    alignSelf: "center",
    marginRight: "auto",
  },
  buttonContainer: {
    marginVertical: 4,
    height: 50,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "red",
    justifyContent: "center",
  },
});
export default PostRegistration;
