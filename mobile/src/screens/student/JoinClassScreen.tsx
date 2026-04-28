import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { joinClass } from "../../api/classes.api";
import { AppButton } from "../../components/AppButton";
import { AppInput } from "../../components/AppInput";
import { ScreenContainer } from "../../components/ScreenContainer";
import type { StudentStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../store/auth.store";

type Props = NativeStackScreenProps<StudentStackParamList, "JoinClass">;

export function JoinClassScreen({ navigation }: Props): React.JSX.Element {
  const token = useAuthStore((state) => state.token);

  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleJoinClass(): Promise<void> {
    if (!token) return;

    const normalizedCode = joinCode.trim().toUpperCase();
    if (!normalizedCode) {
      setError("Join code is required.");
      setSuccess("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await joinClass(token, { joinCode: normalizedCode });
      setSuccess("Joined class successfully.");
      navigation.goBack();
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Failed to join class.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Join Class</Text>
      <Text style={styles.subtitle}>Enter class join code from your teacher.</Text>

      <AppInput
        label="Join Code"
        value={joinCode}
        onChangeText={(value) => setJoinCode(value.toUpperCase())}
        placeholder="ABC123"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}

      <View style={styles.footer}>
        <AppButton title={loading ? "Joining..." : "Join Class"} onPress={handleJoinClass} disabled={loading} />
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
  success: {
    color: "#067647",
    marginTop: 4
  },
  footer: {
    marginTop: 12
  }
});
