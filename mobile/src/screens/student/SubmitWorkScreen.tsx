import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { upsertSubmission } from "../../api/submissions.api";
import { AppButton } from "../../components/AppButton";
import { AppInput } from "../../components/AppInput";
import { ScreenContainer } from "../../components/ScreenContainer";
import type { StudentStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../store/auth.store";

type Props = NativeStackScreenProps<StudentStackParamList, "SubmitWork">;

export function SubmitWorkScreen({ navigation, route }: Props): React.JSX.Element {
  const token = useAuthStore((state) => state.token);

  const [textSubmission, setTextSubmission] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(): Promise<void> {
    if (!token) return;

    const hasValue = Boolean(textSubmission.trim() || fileUrl.trim() || audioUrl.trim());
    if (!hasValue) {
      setError("Add at least one submission field.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await upsertSubmission(token, route.params.assignmentId, {
        textSubmission: textSubmission.trim() || undefined,
        fileUrl: fileUrl.trim() || undefined,
        audioUrl: audioUrl.trim() || undefined
      });
      navigation.goBack();
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Failed to submit work.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Submit Work</Text>
      <Text style={styles.subtitle}>Add text, file URL, or audio URL for your assignment response.</Text>

      <AppInput
        label="Text Submission"
        value={textSubmission}
        onChangeText={setTextSubmission}
        placeholder="Write your answer here"
      />
      <AppInput
        label="File URL (optional)"
        value={fileUrl}
        onChangeText={setFileUrl}
        placeholder="https://example.com/work.pdf"
      />
      <AppInput
        label="Audio URL (optional)"
        value={audioUrl}
        onChangeText={setAudioUrl}
        placeholder="https://example.com/work.mp3"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.footer}>
        <AppButton title={loading ? "Submitting..." : "Submit Work"} onPress={handleSubmit} disabled={loading} />
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
