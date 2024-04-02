import { StyleSheet, Text, View, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { StackActions } from "@react-navigation/native";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Dashboard from "./Dashboard";
import DirectQuit from "./DirectQuit";

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const navigation = useNavigation();

  const handleSingOut = () => {
    FIREBASE_AUTH.signOut()
      .then(() => {
        console.log("Logged out!");
        navigation.dispatch(StackActions.replace("Landing"));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDropdownSelect = (index, value) => {
    console.log(`Selected option ${index}: ${value}`);
    // Add your logic here to handle the selected item
  };

  const getUserDataFromFirestore = async (uid) => {
    try {
      const userDocRef = doc(FIRESTORE_DB, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        return userDocSnap.data();
      } else {
        console.log("User document does not exist");
        return null;
      }
    } catch (error) {
      console.error("Error getting user data from Firestore:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const uid = FIREBASE_AUTH.currentUser?.uid;
        console.log(uid);
        if (uid) {
          const userFirestoreData = await getUserDataFromFirestore(uid);
          setUserData(userFirestoreData);
          if (userFirestoreData.direct) {
            setShouldRedirect(true);
          }
          else if (
            userFirestoreData.amount ||
            userFirestoreData.price ||
            userFirestoreData.direct ||
            userFirestoreData.startPlan
          ) {
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: "PostRegistration" as never }],
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  if (shouldRedirect) {
    return (
      <View style={styles.container}>
        <DirectQuit />
      </View>
    );
  }
  else {
    return (
      <View>
        <Dashboard />
      </View>
    );
  }
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
