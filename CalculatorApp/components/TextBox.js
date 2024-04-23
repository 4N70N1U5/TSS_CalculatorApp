import React from "react";
import { StyleSheet, TextInput } from "react-native";

const TextBox = ({
    value,
    onChangeText,
}) => {
    return (
        <TextInput
            maxLength={10}
            testID="text-input"
            value={value}
            keyboardType="number-pad"
            showSoftInputOnFocus={false}
            onChangeText={onChangeText}
            style={styles.input}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        width: "100%",
        height: "30%",
        fontSize: 75,
        textAlign: "right",
        color: "black",
        fontWeight: "300",
    },
});

export default TextBox;
