import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
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
import * as Haptics from "expo-haptics";

const monthAbbrNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const Dashboard = () => {
  let [smokingData, setSmokingData] = useState([]);
  const [currentData, setCurrentData] = useState([0, 0, 0, 0, 0]);
  const [labels, setLabels] = useState(["0", "0", "0", "0", "0"]);
  const [limitData, setLimitData] = useState([0, 0, 0, 0, 0]);

  const fetchsmokingData = async () => {
    const data = await fetchSmokingActivityData();
    smokingData = data;
  };
  const calculate = async () => {
    await fetchsmokingData();
    await calculateLabels();
    await calculateUserCigarettes();
    await calculateLimit();
  };

  useEffect(() => {
    calculate();
  }, []);

  const fetchSmokingActivityData = async () => {
    try {
      const uid = FIREBASE_AUTH.currentUser?.uid;

      if (uid) {
        const TWO_DAYS = 60 * 60 * 1000 * 24 * 2;
        const currentTime = new Date();
        currentTime.setHours(0, 0, 0, 0);
        const twoDaysAgo = currentTime.getTime() - TWO_DAYS;

        const querySnapshot = await getDocs(
          query(
            collection(FIRESTORE_DB, "smoking_activity"),
            where("user_id", "==", uid),
            where("timestamp", ">=", twoDaysAgo)
          )
        );

        const data = querySnapshot.docs.map((doc) => doc.data());
        return data;
      }
    } catch (error) {
      console.error("Error fetching smoking activity data:", error);
      return [];
    }
  };

  const handleAddCigarette = async () => {
    try {
      const uid = FIREBASE_AUTH.currentUser?.uid;

      if (uid) {
        // Add a record to the smoking_activity table
        await addDoc(collection(FIRESTORE_DB, "smoking_activity"), {
          user_id: uid,
          timestamp: new Date().getTime(),
        });

        alert("Cigarette recorded!");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        calculate();
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      alert("Error recording cigarette!");
      console.error("Error adding cigarette:", error);
    }
  };

  const data_labels = [];

  const fetchUserStartDate = async () => {
    const uid = FIREBASE_AUTH.currentUser?.uid;
    if (uid) {
      const userDocRef = doc(FIRESTORE_DB, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        return userDocSnap.data().startPlan;
      }
    }
  };

  const calculateLabels = async () => {
    let final = [];
    let startDate = await fetchUserStartDate();
    if (startDate == undefined) return;
    startDate = new Date(startDate.seconds * 1000);
    startDate.setHours(0, 0, 0, 0);
    for (let index = 0; index < 5; index++) {
      let date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setTime(date.getTime() + (3 - index) * 24 * 60 * 60 * 1000);
      date.setHours(0, 0, 0, 0);
      data_labels.push(date.getTime());
      const day =
        date.getDate().toString() + " " + monthAbbrNames[date.getMonth()];
      final.push(day).toString();
    }
    final.reverse();
    setLabels(final);
  };

  const findPosition = (targetNumber, dataLabels) => {
    let position = -1;
    for (let i = 0; i < dataLabels.length; i++) {
      if (dataLabels[i] < targetNumber) {
        position = i;
      } else {
        break;
      }
    }

    return position;
  };

  const calculateUserCigarettes = async () => {
    data_labels.reverse();
    const dataPerDay = [0, 0, 0, 0, 0];
    smokingData.forEach((data) => {
      const timestamp = data.timestamp;
      let resultPosition = findPosition(timestamp, data_labels);
      if (resultPosition >= 0) {
        dataPerDay[resultPosition] += 1;
      }
    });
    setCurrentData(dataPerDay);
  };

  const fetchUserAmount = async () => {
    const uid = FIREBASE_AUTH.currentUser?.uid;
    if (uid) {
      const userDocRef = doc(FIRESTORE_DB, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        return userDocSnap.data().amount;
      }
    }
  };

  const calculateLimit = async () => {
    // max(25%, 1) -> 17 -> 17 -> 13 -> 13 -> 9 -> 9 -> 5 -> 5 -> 1~0
    const limitPerDay = [0, 0, 0, 0, 0];
    const userAmount = await fetchUserAmount();
    const userStartDate = await fetchUserStartDate();
    if (userStartDate == undefined) return;
    const userStart = new Date(userStartDate.seconds * 1000);
    const amountPerDay = Math.floor(Math.max(0.25 * userAmount, 1));
    console.log("AmountPerDay", amountPerDay);
    userStart.setHours(0, 0, 0, 0);
    for (let i = 0; i < data_labels.length; i++) {
      let daysPassed = Math.floor(
        (data_labels[i] - userStart.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysPassed % 2 == 1)
        limitPerDay[i] = Math.max(
          Math.floor(userAmount - amountPerDay * Math.floor(daysPassed / 2)),
          0
        );
      else
        limitPerDay[i] = Math.max(
          Math.floor(
            userAmount -
            amountPerDay * Math.max(Math.floor(daysPassed / 2) - 1, 0)
          ),
          0
        );
    }
    console.log("Limit per day: ", limitPerDay);
    setLimitData(limitPerDay);
  };

  return (
    <View style={styles.container}>
      <View style={styles.graphContainer}>
        <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: currentData,
                color: (opacity) => "green",
              },
              {
                data: limitData,
                color: (opacity) => "red",
              },
            ],
          }}
          width={Dimensions.get("window").width - 60} // from react-native
          height={Dimensions.get("window").width - 60}
          yAxisLabel=""
          yAxisSuffix=""
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "white",
            backgroundGradientFrom: "white",
            backgroundGradientTo: "white",
            paddingTop: 20,
            paddingRight: 20,
            decimalPlaces: 0, // optional, defaults to 2dp
            color: () => "darkgrey",
            labelColor: () => "darkgrey",
            style: {
              borderRadius: 10,
              margin: "auto",
            },
            propsForDots: {
              r: "7",
              strokeWidth: "2",
              stroke: "white",
            },
          }}
          bezier
          style={{
          }}
        />
        <Text style={styles.label}>Smoking activity</Text>
      </View>
      <Button title="Add Cigarette" onPress={handleAddCigarette} />
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    margin: 20,
  },
  graphContainer: {
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 1,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 17,
    position: "absolute",
    bottom: 10,
  },
});
