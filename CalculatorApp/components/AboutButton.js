import { useNavigation } from "@react-navigation/native"
import React from "react"
import { Button } from "react-native"

const AboutButton = () => {
    const navigation = useNavigation()

    return (
        <Button
            title="About"
            onPress={() => {
                navigation.navigate("About");
            }}
        />
    );
}

export default AboutButton
