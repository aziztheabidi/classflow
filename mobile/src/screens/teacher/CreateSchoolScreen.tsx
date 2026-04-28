import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createSchool } from "../../api/schools.api";
import { AppButton } from "../../components/AppButton";
import { AppInput } from "../../components/AppInput";
import { ScreenContainer } from "../../components/ScreenContainer";
import type { TeacherStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../store/auth.store";

type Props = NativeStackScreenProps<TeacherStackParamList, "CreateSchool">;

export function CreateSchoolScreen({ navigation }: Props): React.JSX.Element {
  const token = useAuthStore((state) => state.token);

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreateSchool(): Promise<void> {
    if (!token) return;
    if (!name.trim()) {
      setError("School name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await createSchool(token, { name: name.trim() });
      Alert.alert("Created", "School created successfully.");
      navigation.goBack();
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Failed to create school.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Create School</Text>
      <Text style={styles.subtitle}>Set up your school first before creating classes.</Text>

      <AppInput label="School Name" value={name} onChangeText={setName} placeholder="My School" />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.footer}>
        <AppButton title={loading ? "Creating..." : "Create School"} onPress={handleCreateSchool} disabled={loading} />
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
