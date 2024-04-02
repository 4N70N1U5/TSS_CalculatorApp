import { StyleSheet, Text, View, Button, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { StackActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { doc, setDoc, getDoc } from "firebase/firestore";

const Profile = () => {
  const [userData, setUserData] = useState(null);

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

          if (
            userFirestoreData.amount ||
            userFirestoreData.price ||
            userFirestoreData.direct ||
            userFirestoreData.startPlan
          ) {
          } else {
            navigation.dispatch(StackActions.replace("PostRegistration"));
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Ionicons name="person-circle" size={100} color="darkgrey" style={{ alignSelf: "center", marginLeft: 6.3 }} />
        {userData ? <Text style={styles.headerText}>{userData.username}</Text> : <ActivityIndicator size="small" />}
      </View>

      <View style={{ height: 70 }}>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleSingOut}>
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
  },
  userInfoContainer: {
    flex: 1,
  },
  headerText: {
    fontSize: 22,
    textAlign: "center",
    alignSelf: "center",
  },
  buttonContainer: {
    marginVertical: 4,
    height: 50,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "red",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
});
