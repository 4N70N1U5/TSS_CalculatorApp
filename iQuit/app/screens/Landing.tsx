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
import { useNavigation } from "@react-navigation/native";
import { StackActions } from "@react-navigation/native";
import { SvgXml } from 'react-native-svg';
import { doc, getDoc } from "firebase/firestore";

const Landing = ({ navigation }) => {
  // const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loading, setLoading] = useState(true);
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.dispatch(StackActions.replace("TabNavigator"));
      }
      else {
        setIsLoggedIn(false);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const goToRegister = () => {
    navigation.navigate("Sign up");
  };

  const logoXml = `
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="44" width="33.3333" height="12" fill="url(#paint0_linear_12_23)"/>
    <rect x="26.6667" y="44" width="1.66667" height="12" fill="url(#paint1_linear_12_23)"/>
    <rect x="25" y="44" width="1.66667" height="12" fill="url(#paint2_linear_12_23)"/>
    <path d="M20 46C20 44.8954 20.8954 44 22 44H23.3333V56H22C20.8954 56 20 55.1046 20 54V46Z" fill="url(#paint3_linear_12_23)"/>
    <path d="M63.3333 44H78C79.1046 44 80 44.8954 80 46V54C80 55.1046 79.1046 56 78 56H63.3333V44Z" fill="url(#paint4_linear_12_23)"/>
    <rect x="14" y="77.6396" width="90" height="10" rx="1.5" transform="rotate(-45 14 77.6396)" fill="url(#paint5_linear_12_23)"/>
    <circle cx="50" cy="50" r="45" stroke="url(#paint6_linear_12_23)" stroke-width="10"/>
    <defs>
    <linearGradient id="paint0_linear_12_23" x1="46.6667" y1="44" x2="46.6667" y2="56" gradientUnits="userSpaceOnUse">
    <stop stop-color="#E4E4E7"/>
    <stop offset="1" stop-color="#C7C7CC"/>
    </linearGradient>
    <linearGradient id="paint1_linear_12_23" x1="27.5" y1="44" x2="27.5" y2="56" gradientUnits="userSpaceOnUse">
    <stop stop-color="#E4E4E7"/>
    <stop offset="1" stop-color="#C7C7CC"/>
    </linearGradient>
    <linearGradient id="paint2_linear_12_23" x1="25.8333" y1="44" x2="25.8333" y2="56" gradientUnits="userSpaceOnUse">
    <stop stop-color="#E4E4E7"/>
    <stop offset="1" stop-color="#C7C7CC"/>
    </linearGradient>
    <linearGradient id="paint3_linear_12_23" x1="21.6667" y1="44" x2="21.6667" y2="56" gradientUnits="userSpaceOnUse">
    <stop stop-color="#E4E4E7"/>
    <stop offset="1" stop-color="#C7C7CC"/>
    </linearGradient>
    <linearGradient id="paint4_linear_12_23" x1="71.6667" y1="44" x2="71.6667" y2="56" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FFBF66"/>
    <stop offset="1" stop-color="#FF9500"/>
    </linearGradient>
    <linearGradient id="paint5_linear_12_23" x1="23.6446" y1="118.907" x2="108.511" y2="76.5792" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FF3B30"/>
    <stop offset="1" stop-color="#FF6E66"/>
    </linearGradient>
    <linearGradient id="paint6_linear_12_23" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FF6E66"/>
    <stop offset="1" stop-color="#FF3B30"/>
    </linearGradient>
    </defs>
    </svg>
  `;

  const appleLogoXml = `
    <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.11035 2.96387C8.5542 3.63623 7.62451 4.13428 6.88574 4.13428C6.79443 4.13428 6.71143 4.11768 6.66162 4.10938C6.65332 4.06787 6.62842 3.94336 6.62842 3.81055C6.62842 2.96387 7.06006 2.11719 7.5332 1.58594C8.12256 0.888672 9.11865 0.374023 9.94873 0.34082C9.96533 0.432129 9.97363 0.54834 9.97363 0.664551C9.97363 1.51123 9.6167 2.34961 9.11035 2.96387ZM9.69141 4.30859C10.1562 4.30859 11.8413 4.3584 12.9453 5.94385C12.8457 6.01855 11.1772 6.96484 11.1772 9.07324C11.1772 11.5054 13.3022 12.377 13.3687 12.3936C13.3604 12.4517 13.0283 13.5723 12.248 14.7261C11.5425 15.7305 10.8037 16.7515 9.69141 16.7515C8.5708 16.7515 8.28027 16.0957 7.00195 16.0957C5.74023 16.0957 5.29199 16.7681 4.2793 16.7681C3.25 16.7681 2.53613 15.8301 1.72266 14.6846C0.768066 13.3315 0.00439453 11.2314 0.00439453 9.23926C0.00439453 6.05176 2.07959 4.3584 4.12988 4.3584C5.20898 4.3584 6.10547 5.06396 6.79443 5.06396C7.44189 5.06396 8.45459 4.30859 9.69141 4.30859Z" fill="black"/>
    </svg>  
  `;

  const googleLogoXml = `
    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_17_24" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="21" height="20">
    <path d="M20.2164 0H0.141792V20H20.2164V0Z" fill="white"/>
    </mask>
    <g mask="url(#mask0_17_24)">
    <path d="M19.8149 10.2273C19.8149 9.51819 19.7511 8.83639 19.6325 8.18179H10.1791V12.05H15.581C15.3483 13.3 14.6412 14.3591 13.5781 15.0682V17.5773H16.822C18.72 15.8364 19.8149 13.2727 19.8149 10.2273Z" fill="#4285F4"/>
    <path d="M10.1792 20C12.8893 20 15.1613 19.1045 16.8221 17.5773L13.5782 15.0682C12.6794 15.6682 11.5296 16.0227 10.1792 16.0227C7.56488 16.0227 5.35216 14.2636 4.56282 11.9H1.20946V14.4909C2.8611 17.7591 6.25552 20 10.1792 20Z" fill="#34A853"/>
    <path d="M4.56273 11.9C4.36198 11.3 4.24796 10.6591 4.24796 9.99999C4.24796 9.34089 4.36198 8.69999 4.56273 8.09999V5.50909H1.20936C0.529635 6.85909 0.141792 8.38639 0.141792 9.99999C0.141792 11.6136 0.529635 13.1409 1.20936 14.4909L4.56273 11.9Z" fill="#FBBC04"/>
    <path d="M10.1792 3.9773C11.6529 3.9773 12.9759 4.4818 14.0162 5.4727L16.8951 2.6045C15.1568 0.9909 12.8847 0 10.1792 0C6.25552 0 2.8611 2.2409 1.20946 5.5091L4.56282 8.1C5.35216 5.7364 7.56488 3.9773 10.1792 3.9773Z" fill="#E94235"/>
    </g>
    </svg>
  `;

  return (
    <View style={styles.container}>
      <View style={styles.hStack}>
        <SvgXml xml={logoXml} style={styles.logo} />
        <Text style={styles.heading2}>Welcome to{"\n"}<Text style={styles.heading1}>iQuit</Text></Text>
      </View>
      {loading ? <ActivityIndicator size="large" style={styles.loadingIcon} /> : <></>}
      {!isLoggedIn ? <View style={styles.buttonStack}>
        <TouchableOpacity style={styles.emailButton} onPress={() => goToRegister()}>
          <Text style={styles.emailButtonText}>Continue with email</Text>
        </TouchableOpacity>
        <Text style={styles.bottomText}>Coming soon</Text>
        <TouchableOpacity style={styles.socialButton} onPress={() => { alert("Sign in with Apple coming soon!"); }}>
          <SvgXml xml={appleLogoXml} />
          <Text style={styles.socialButtonText}>Sign in with Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={() => { alert("Sign in with Google coming soon!"); }}>
          <SvgXml xml={googleLogoXml} />
          <Text style={styles.socialButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View> : <></>}
    </View>
  );
};

export default Landing;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 60,
    flex: 1,
    justifyContent: "center",
  },
  hStack: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonStack: {
    width: "100%",
    alignSelf: "center",
    position: "absolute",
    bottom: 60,
  },
  heading1: {
    marginHorizontal: 7.5,
    fontSize: 34,
    fontWeight: "600",
  },
  heading2: {
    marginHorizontal: 7.5,
    fontSize: 28,
    fontWeight: "600",
  },
  logo: {
    margin: 7.5,
  },
  loadingIcon: {
    alignSelf: "center",
    position: "absolute",
    bottom: 200,
  },
  emailButton: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "black",
    justifyContent: "center",
  },
  socialButton: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1.5,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  emailButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
  socialButtonText: {
    color: "black",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    marginHorizontal: 10,
  },
  bottomText: {
    marginVertical: 4,
    fontSize: 17,
    textAlign: "center",
    color: "grey",
  },
});
