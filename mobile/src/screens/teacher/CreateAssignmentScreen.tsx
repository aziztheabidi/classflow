import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createAssignment } from "../../api/assignments.api";
import { AppButton } from "../../components/AppButton";
import { AppInput } from "../../components/AppInput";
import { ScreenContainer } from "../../components/ScreenContainer";
import type { TeacherStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../store/auth.store";

type Props = NativeStackScreenProps<TeacherStackParamList, "CreateAssignment">;

export function CreateAssignmentScreen({ navigation, route }: Props): React.JSX.Element {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const { classId } = route.params;

  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [contentText, setContentText] = useState("");
  const [contentFileUrl, setContentFileUrl] = useState("");
  const [contentAudioUrl, setContentAudioUrl] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isTeacher = user?.role === "TEACHER";

  async function handleSubmit(): Promise<void> {
    if (!token || !isTeacher) return;
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await createAssignment(token, classId, {
        title: title.trim(),
        instructions: instructions.trim() || undefined,
        contentText: contentText.trim() || undefined,
        contentFileUrl: contentFileUrl.trim() || undefined,
        contentAudioUrl: contentAudioUrl.trim() || undefined,
        dueDate: dueDate.trim() || undefined
      });
      navigation.goBack();
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Failed to create assignment.");
    } finally {
      setLoading(false);
    }
  }

  if (!isTeacher) {
    return (
      <ScreenContainer>
        <Text style={styles.title}>Unauthorized</Text>
        <Text style={styles.subtitle}>Only teachers can access this screen.</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Create Assignment</Text>
      <Text style={styles.subtitle}>Create a class assignment post for students.</Text>

      <AppInput label="Title" value={title} onChangeText={setTitle} placeholder="Math Homework 1" />
      <AppInput label="Instructions" value={instructions} onChangeText={setInstructions} placeholder="What students should do" />
      <AppInput label="Text Content (optional)" value={contentText} onChangeText={setContentText} placeholder="Additional context" />
      <AppInput label="File URL (optional)" value={contentFileUrl} onChangeText={setContentFileUrl} placeholder="https://example.com/file.pdf" />
      <AppInput label="Audio URL (optional)" value={contentAudioUrl} onChangeText={setContentAudioUrl} placeholder="https://example.com/audio.mp3" />
      <AppInput
        label="Due Date (optional, ISO format)"
        value={dueDate}
        onChangeText={setDueDate}
        placeholder="2026-05-01T10:00:00.000Z"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.footer}>
        <AppButton title={loading ? "Creating..." : "Create Assignment"} onPress={handleSubmit} disabled={loading} />
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
