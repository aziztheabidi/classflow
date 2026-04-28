import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { sendOtp } from "../../api/auth.api";
import { AppButton } from "../../components/AppButton";
import { AppInput } from "../../components/AppInput";
import { ScreenContainer } from "../../components/ScreenContainer";
import type { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "PhoneLogin">;

export function PhoneLoginScreen({ navigation, route }: Props): React.JSX.Element {
  const role = route.params.role;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const phoneError = useMemo(() => {
    const cleaned = phoneNumber.trim();
    if (!cleaned) return "Phone number is required.";
    if (cleaned.length < 8) return "Phone number should be at least 8 digits.";
    return "";
  }, [phoneNumber]);

  async function handleSendCode(): Promise<void> {
    if (phoneError) {
      setError(phoneError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      await sendOtp({
        phoneNumber: phoneNumber.trim(),
        role,
        name: name.trim() || undefined
      });

      navigation.navigate("OtpVerify", {
        role,
        phoneNumber: phoneNumber.trim(),
        name: name.trim() || undefined
      });
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Failed to send code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Continue as {role === "TEACHER" ? "Teacher" : "Student"}</Text>
      <Text style={styles.subtitle}>Enter your phone number to receive the OTP code.</Text>

      <AppInput label="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} placeholder="0912345678" />
      <AppInput label="Name (optional)" value={name} onChangeText={setName} placeholder="Your name" />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.footer}>
        <AppButton title={loading ? "Sending..." : "Send Code"} onPress={handleSendCode} disabled={loading} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    color: "#101828"
  },
  subtitle: {
    fontSize: 14,
    color: "#667085",
    marginBottom: 16
  },
  error: {
    color: "#b42318",
    marginTop: 4
  },
  footer: {
    marginTop: 12
  }
});
