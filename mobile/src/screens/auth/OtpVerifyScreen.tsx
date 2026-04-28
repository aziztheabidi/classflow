import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { verifyOtp } from "../../api/auth.api";
import { AppButton } from "../../components/AppButton";
import { AppInput } from "../../components/AppInput";
import { ScreenContainer } from "../../components/ScreenContainer";
import type { AuthStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../store/auth.store";

type Props = NativeStackScreenProps<AuthStackParamList, "OtpVerify">;

export function OtpVerifyScreen({ route }: Props): React.JSX.Element {
  const setAuth = useAuthStore((state) => state.setAuth);
  const { phoneNumber, role, name } = route.params;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const otpError = useMemo(() => {
    const cleaned = otp.trim();
    if (!cleaned) return "OTP is required.";
    if (cleaned.length < 4) return "OTP looks too short.";
    return "";
  }, [otp]);

  async function handleVerify(): Promise<void> {
    if (otpError) {
      setError(otpError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await verifyOtp({
        phoneNumber,
        otp: otp.trim(),
        role,
        name
      });

      // Role-based landing happens automatically in RootNavigator after auth store updates.
      setAuth({
        token: response.token,
        user: response.user
      });
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>Use `123456` for this POC.</Text>

      <AppInput label="OTP Code" value={otp} onChangeText={setOtp} placeholder="123456" />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.footer}>
        <AppButton title={loading ? "Verifying..." : "Verify"} onPress={handleVerify} disabled={loading} />
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
