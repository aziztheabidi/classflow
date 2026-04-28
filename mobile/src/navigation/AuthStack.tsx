import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "./types";
import { OtpVerifyScreen } from "../screens/auth/OtpVerifyScreen";
import { PhoneLoginScreen } from "../screens/auth/PhoneLoginScreen";
import { WelcomeScreen } from "../screens/auth/WelcomeScreen";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} options={{ title: "Sign In" }} />
      <Stack.Screen name="OtpVerify" component={OtpVerifyScreen} options={{ title: "Verify OTP" }} />
    </Stack.Navigator>
  );
}
