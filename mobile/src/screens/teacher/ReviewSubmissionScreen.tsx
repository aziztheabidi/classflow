import React, { useState } from "react";
import { Linking, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { upsertFeedback } from "../../api/feedback.api";
import { AppButton } from "../../components/AppButton";
import { AppInput } from "../../components/AppInput";
import { ScreenContainer } from "../../components/ScreenContainer";
import type { TeacherStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../store/auth.store";

type Props = NativeStackScreenProps<TeacherStackParamList, "ReviewSubmission">;

export function ReviewSubmissionScreen({ navigation, route }: Props): React.JSX.Element {
  const token = useAuthStore((state) => state.token);
  const {
    submissionId,
    studentName,
    textSubmission,
    fileUrl,
    audioUrl,
    currentStatus
  } = route.params;

  const [comment, setComment] = useState("");
  const [markedDone, setMarkedDone] = useState(currentStatus === "REVIEWED");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSaveReview(): Promise<void> {
    if (!token) return;
    try {
      setLoading(true);
      setError("");
      await upsertFeedback(token, submissionId, {
        comment: comment.trim() || undefined,
        markedDone
      });
      navigation.goBack();
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Failed to save feedback.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>{studentName ?? "Student Submission"}</Text>
      <Text style={styles.status}>Current Status: {currentStatus}</Text>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Text Submission</Text>
        <Text style={styles.blockValue}>{textSubmission || "No text submission provided."}</Text>
      </View>

      {fileUrl ? (
        <Pressable onPress={() => void Linking.openURL(fileUrl)}>
          <Text style={styles.link}>Open File URL</Text>
        </Pressable>
      ) : null}

      {audioUrl ? (
        <Pressable onPress={() => void Linking.openURL(audioUrl)}>
          <Text style={styles.link}>Open Audio URL</Text>
        </Pressable>
      ) : null}

      <AppInput label="Feedback" value={comment} onChangeText={setComment} placeholder="Write feedback for the student" />

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Mark as done (Reviewed)</Text>
        <Switch value={markedDone} onValueChange={setMarkedDone} />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <AppButton title={loading ? "Saving..." : "Save Review"} onPress={handleSaveReview} disabled={loading} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#101828",
    marginBottom: 4
  },
  status: {
    color: "#667085",
    marginBottom: 12
  },
  block: {
    borderWidth: 1,
    borderColor: "#d0d5dd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  blockTitle: {
    fontWeight: "600",
    marginBottom: 6,
    color: "#344054"
  },
  blockValue: {
    color: "#101828"
  },
  link: {
    color: "#155eef",
    marginBottom: 8
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12
  },
  toggleLabel: {
    color: "#344054",
    fontWeight: "500"
  },
  error: {
    color: "#b42318",
    marginBottom: 8
  }
});
