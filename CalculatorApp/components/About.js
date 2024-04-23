import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';

const About = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}> App created by zero7zero5 on GitHub </Text>
            <Text
                style={[styles.link]}
                onPress={() => Linking.openURL("https://github.com/zero7zero5/React-Native-Calculator-App")}>
                github.com/zero7zero5/React-Native-Calculator-App
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        margin: 10,
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
});

export default About;