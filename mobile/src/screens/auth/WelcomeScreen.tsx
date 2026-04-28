import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScreenContainer } from "../../components/ScreenContainer";
import type { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Welcome">;

export function WelcomeScreen({ navigation }: Props): React.JSX.Element {
  return (
    <ScreenContainer>
      <View style={styles.wrapper}>
        <Text style={styles.title}>School Assignment POC</Text>
        <Text style={styles.subtitle}>Choose how you want to continue</Text>

        <Pressable style={styles.button} onPress={() => navigation.navigate("PhoneLogin", { role: "TEACHER" })}>
          <Text style={styles.buttonTitle}>I am a Teacher</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.secondary]}
          onPress={() => navigation.navigate("PhoneLogin", { role: "STUDENT" })}
        >
          <Text style={styles.buttonTitle}>I am a Student</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center"
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#101828",
    marginBottom: 8
  },
  subtitle: {
    fontSize: 15,
    color: "#667085",
    marginBottom: 24
  },
  button: {
    backgroundColor: "#155eef",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 12
  },
  secondary: {
    backgroundColor: "#364152"
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff"
  }
});
