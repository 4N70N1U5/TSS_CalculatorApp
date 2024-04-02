import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Image, Button } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import * as Haptics from "expo-haptics";

const DirectQuit = () => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [cigarettesPerDay, setCigarettesPerDay] = useState(0);
  const [pricePerPack, setPricePerPack] = useState(0);
  const [currentWeek, setCurrentWeek] = useState([
    { day: 0, entries: 0, startOfDayTimestamp: 0, endOfDayTimestamp: 0 },
    { day: 0, entries: 0, startOfDayTimestamp: 0, endOfDayTimestamp: 0 },
    { day: 0, entries: 0, startOfDayTimestamp: 0, endOfDayTimestamp: 0 },
    { day: 0, entries: 0, startOfDayTimestamp: 0, endOfDayTimestamp: 0 },
    { day: 0, entries: 0, startOfDayTimestamp: 0, endOfDayTimestamp: 0 },
    { day: 0, entries: 0, startOfDayTimestamp: 0, endOfDayTimestamp: 0 },
    { day: 0, entries: 0, startOfDayTimestamp: 0, endOfDayTimestamp: 0 }
  ]); // [ { day: 0, entries: 0, startOfDayTimestamp: 0, endOfDayTimestamp: 0 }, ...

  const [showMilestonePopup, setShowMilestonePopup] = useState(false);
  // Dummy data for days of the week (replace with actual data)
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const streakData = []; // Replace with actual streak data
  //Suppose the average number of cigarettes per pack is 20:
  const getMoneySaved = () => (cigarettesPerDay / 20) * pricePerPack * currentStreak;

  const navigation = useNavigation();

  const handleOpenMilestoneScreen = () => {
    console.log("longest streak: ", longestStreak);
    navigation.navigate('Milestones', { longestStreak });
  };

  const getCurrentUserId = () => {
    try {
      const uid = FIREBASE_AUTH.currentUser?.uid;
      if (uid) {
        return uid;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getData = async () => {
    await calculateNonSmokingStreak();
    await getStreakData();
    await getMoneySavedForCurrentStreak();
  }

  const handleResetCurrentStreak = async () => {
    const userId = getCurrentUserId();
    if (userId) {
      await addDoc(collection(FIRESTORE_DB, "smoking_activity"), {
        user_id: userId,
        timestamp: new Date().getTime(),
      });
      //check longest streak by excluding today from the current streak:
      if (currentStreak > longestStreak) {
        setLongestStreak(currentStreak);
      }
      setCurrentStreak(0);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      alert("Your streak has been reset! A cigarette has been recorded.");
    }
  }

  const getMoneySavedForCurrentStreak = async () => {

    const userId = getCurrentUserId();
    const q = query(collection(FIRESTORE_DB, "users"), where("id", "==", userId));
    const querySnapshot = await getDocs(q);
    const amount = querySnapshot.docs[0].data().amount;
    const price = querySnapshot.docs[0].data().price;
    const maxStreak = querySnapshot.docs[0].data().longestStreak;
    setCigarettesPerDay(amount);
    setPricePerPack(price);
    setLongestStreak(maxStreak);
  };

  const getStreakData = async () => {
    //check if there are cigarretes smoked this week:
    const userId = getCurrentUserId();
    const q = query(collection(FIRESTORE_DB, "smoking_activity"), where("user_id", "==", userId));
    const querySnapshot = await getDocs(q);
    // Get the start and end timestamps for the current week
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));

    let thisWeek = [];
    // Iterate through each day of the week
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);

      // Get the timestamp for the start of the day
      const startOfDayTimestamp = currentDay.setHours(0, 0, 0, 0);

      // Get the timestamp for the end of the day
      const endOfDayTimestamp = currentDay.setHours(23, 59, 59, 999);

      // Check if there are entries for the current day
      const entriesForDay = querySnapshot.docs.filter(doc => {
        const timestamp = doc.data().timestamp; // Assuming you store the timestamp in Firestore as a server timestamp
        return timestamp >= startOfDayTimestamp && timestamp <= endOfDayTimestamp;
      });

      thisWeek.push({
        day: currentDay.getDay(), // Add the day index (0 for Sunday, 1 for Monday, etc.) if needed
        entries: entriesForDay.length,
        startOfDayTimestamp,
        endOfDayTimestamp,
      });
    }

    setCurrentWeek(thisWeek);
    //console.log('This week: ', thisWeek[1].entries);
  };


  const calculateNonSmokingStreak = async () => {
    const userId = getCurrentUserId();
    const q = query(collection(FIRESTORE_DB, "smoking_activity"), where("user_id", "==", userId));
    const querySnapshot = await getDocs(q);
    const user = query(collection(FIRESTORE_DB, "users"), where("id", "==", userId));
    const userSnapshot = await getDocs(user);

    if (!querySnapshot.empty) {
      // sort data desc based on timestamp:
      const sortedData = querySnapshot.docs.map(doc => doc.data()).sort((a, b) => b.timestamp - a.timestamp);
      // get current day:
      const currentDay = new Date().getTime();
      // get yesterday:
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      console.log("yesterday: ", yesterday);
      // get last cigarrete recorded:
      const lastCigarette = sortedData[0];
      console.log("last cigarette: ", lastCigarette)
      console.log(lastCigarette.timestamp);
      // get streak:
      let streak = Math.floor((currentDay - lastCigarette.timestamp) / (1000 * 60 * 60 * 24));

      //add currentDay to streak:
      //if(streak != 0)
      //    streak += 1;
      console.log(streak);
      setCurrentStreak(streak);
      if (streak > longestStreak) {
        setLongestStreak(streak);
        // update longest streak in db:
        const docRef = doc(FIRESTORE_DB, "users", userSnapshot.docs[0].id);
        await setDoc(docRef, {
          longestStreak: streak
        }, { merge: true });
      }
    } else {
      console.log("no data found");
      setCurrentStreak(0);
    }
  };

  useEffect(() => {
    getData();
    if (currentStreak > longestStreak) {
      setLongestStreak(currentStreak);
    }
  }, [currentStreak]);

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoValue}>{currentStreak}</Text>
          <Text style={styles.infoLabel}>Current streak</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoValue}>${getMoneySaved()}</Text>
          <Text style={styles.infoLabel}>Money saved</Text>
        </View>
      </View>

      <View style={styles.weekContainer}>
        {/* Days of the week circles */}
        <View style={styles.daysContainer}>
          {daysOfWeek.map((day, index) => {
            const today = new Date().getDay();
            return (
              <View
                key={index}
                style={[
                  styles.dayCircle,
                  currentWeek[index].entries === 0 ? styles.greenCircle : styles.redCircle,
                  index > today ? styles.lightGrayCircle : null,
                  index === today ? styles.redCircle : null,
                  index === today && currentWeek[index].entries === 0 ? styles.yellowCircle : null,
                ]}
              >
                <Text style={styles.dayInitials}>{day}</Text>
              </View>
            );
          })}
        </View>
        <Text style={{ fontSize: 17, margin: 5 }}>Week progress</Text>
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoValue}>{longestStreak}</Text>
          <Text style={styles.infoLabel}>Longest streak</Text>
        </View>
        <View style={styles.infoContainer}>
          <Button title="View milestones" onPress={handleOpenMilestoneScreen} />
        </View>
      </View>

      <Button title="Reset streak (record cigarette)" onPress={handleResetCurrentStreak} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'space-between',
    gap: 20,
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  infoValue: {
    fontSize: 50,
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 17,
    position: "absolute",
    bottom: 10,
  },
  weekContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayCircle: {
    width: (Dimensions.get('window').width - 120) / 7,
    aspectRatio: 1,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  greenCircle: {
    backgroundColor: 'green',
  },
  redCircle: {
    backgroundColor: 'red',
  },
  lightGrayCircle: {
    backgroundColor: 'lightgray',
  },
  darkGrayCircle: {
    backgroundColor: 'darkgray',
  },
  yellowCircle: {
    backgroundColor: 'gold',
  },
  dayInitials: {
    fontSize: 13,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DirectQuit;
