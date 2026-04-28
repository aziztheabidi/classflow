import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getAssignmentSubmissions, type PendingStudent, type SubmissionItem } from "../../api/submissions.api";
import { ScreenContainer } from "../../components/ScreenContainer";
import type { TeacherStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../store/auth.store";

type Props = NativeStackScreenProps<TeacherStackParamList, "Submissions">;

type Row =
  | { kind: "submitted"; submission: SubmissionItem }
  | { kind: "pending"; pending: PendingStudent };

export function SubmissionsScreen({ navigation, route }: Props): React.JSX.Element {
  const token = useAuthStore((state) => state.token);
  const { assignmentId, assignmentTitle } = route.params;

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(
    async (isRefresh = false): Promise<void> => {
      if (!token) return;
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError("");
        const response = await getAssignmentSubmissions(token, assignmentId);
        const submittedRows: Row[] = response.submissions.map((submission) => ({
          kind: "submitted",
          submission
        }));
        const pendingRows: Row[] = response.pendingStudents.map((pending) => ({
          kind: "pending",
          pending
        }));
        setRows([...submittedRows, ...pendingRows]);
      } catch (apiError) {
        setError(apiError instanceof Error ? apiError.message : "Failed to load submissions.");
      } finally {
        if (isRefresh) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [assignmentId, token]
  );

  useEffect(() => {
    void load(false);
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      void load(false);
    }, [load])
  );

  return (
    <ScreenContainer>
      {assignmentTitle ? <Text style={styles.title}>{assignmentTitle}</Text> : null}
      <Text style={styles.subtitle}>Submitted, Reviewed, and Pending students</Text>

      {loading ? <Text style={styles.helper}>Loading submissions...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!loading && !error ? (
        <FlatList
          data={rows}
          keyExtractor={(item, index) =>
            item.kind === "submitted" ? item.submission.id : `pending-${item.pending.studentId}-${index}`
          }
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} />}
          ListEmptyComponent={<Text style={styles.helper}>No students found for this assignment.</Text>}
          renderItem={({ item }) => {
            if (item.kind === "pending") {
              return (
                <View style={[styles.card, styles.pendingCard]}>
                  <Text style={styles.name}>{item.pending.studentName ?? "Unnamed Student"}</Text>
                  <Text style={styles.meta}>{item.pending.phoneNumber}</Text>
                  <Text style={styles.pending}>Pending</Text>
                </View>
              );
            }

            const statusText = item.submission.status === "REVIEWED" ? "Reviewed" : "Submitted";
            return (
              <Pressable
                style={styles.card}
                onPress={() =>
                  navigation.navigate("ReviewSubmission", {
                    submissionId: item.submission.id,
                    studentName: item.submission.studentName,
                    textSubmission: item.submission.textSubmission,
                    fileUrl: item.submission.fileUrl,
                    audioUrl: item.submission.audioUrl,
                    currentStatus: item.submission.status
                  })
                }
              >
                <Text style={styles.name}>{item.submission.studentName ?? "Unnamed Student"}</Text>
                <Text style={styles.meta}>{item.submission.phoneNumber}</Text>
                <Text style={item.submission.status === "REVIEWED" ? styles.reviewed : styles.submitted}>
                  {statusText}
                </Text>
              </Pressable>
            );
          }}
        />
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#101828",
    marginBottom: 4
  },
  subtitle: {
    color: "#667085",
    marginBottom: 12
  },
  helper: {
    color: "#667085"
  },
  error: {
    color: "#b42318",
    marginBottom: 8
  },
  card: {
    borderWidth: 1,
    borderColor: "#d0d5dd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10
  },
  pendingCard: {
    backgroundColor: "#f9fafb"
  },
  name: {
    fontWeight: "600",
    color: "#101828"
  },
  meta: {
    color: "#667085",
    marginTop: 2
  },
  submitted: {
    marginTop: 6,
    color: "#155eef",
    fontWeight: "600"
  },
  reviewed: {
    marginTop: 6,
    color: "#067647",
    fontWeight: "600"
  },
  pending: {
    marginTop: 6,
    color: "#b54708",
    fontWeight: "600"
  }
});
