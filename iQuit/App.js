import Login from "./app/screens/Login";
import Register from "./app/screens/Register";
import Home from "./app/screens/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import PostRegistration from "./app/screens/PostRegistration";
import Options from "./app/screens/Options";
import Profile from "./app/screens/Profile";
import Landing from "./app/screens/Landing";
import DirectQuit from "./app/screens/DirectQuit";
import Milestones from "./app/screens/Milestones";
import { usePushNotifications } from "./usePushNotifications";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { requestNotificationPermission } from './usePushNotifications';
import { StatusBar } from "expo-status-bar";


const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    };
  },
});
const Tab = createBottomTabNavigator();

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        options={{
          headerTitle: "Dashboard",
          // headerTitle: "iQuit",
          // headerRight: () => <Options />,
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
            // <MaterialIcons name="space-dashboard" size={size} color={color} />
          ),
        }}
        component={Home}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator>
        <Stack.Screen
          name="Landing"
          component={Landing}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Sign up"
          component={Register}
        />
        <Stack.Screen
          name="Sign in"
          component={Login}
        />
        <Stack.Screen
          name="PostRegistration"
          component={PostRegistration}
          options={{
            headerTitle: "Complete Registration",
          }}
        />
        <Stack.Screen
          name="TabNavigator"
          component={MainTabNavigator}
          options={{
            headerShown: false
          }}
        />
        {/* <Stack.Screen
          name="Home"
          options={{
            headerTitle: "iQuit",
            headerRight: () => <Options />,
          }}
          component={Home}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
        /> */}
        <Stack.Screen
          name="DirectQuit"
          component={DirectQuit}
        />
        <Stack.Screen
          name="Milestones"
          component={Milestones}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
