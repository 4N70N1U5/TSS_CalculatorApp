import { StyleSheet, Text, View, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { StackActions } from "@react-navigation/native";

const Options = () => {
  const navigation = useNavigation();

  return (
    <Button
      title="Profile"
      onPress={() => {
        navigation.navigate("Profile" as never);
      }}
    />
  );
};

export default Options;
