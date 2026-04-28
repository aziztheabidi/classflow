import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Linking, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getClassFeed, type FeedItem } from "../../api/posts.api";
import { AppButton } from "../../components/AppButton";
import { ScreenContainer } from "../../components/ScreenContainer";
import type { StudentStackParamList, TeacherStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../store/auth.store";

type Props =
  | NativeStackScreenProps<TeacherStackParamList, "ClassFeed">
  | NativeStackScreenProps<StudentStackParamList, "ClassFeed">;

export function ClassFeedScreen({ navigation, route }: Props): React.JSX.Element {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const { classId } = route.params;

  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const isTeacher = user?.role === "TEACHER";

  const loadFeed = useCallback(
    async (isRefresh = false): Promise<void> => {
      if (!token) return;
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError("");
        const response = await getClassFeed(token, classId, { limit: 20 });
        setItems(response.feed.items);
      } catch (apiError) {
        setError(apiError instanceof Error ? apiError.message : "Failed to load class feed.");
      } finally {
        if (isRefresh) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [classId, token]
  );

  useEffect(() => {
    void loadFeed(false);
  }, [loadFeed]);

  useFocusEffect(
    useCallback(() => {
      void loadFeed(false);
    }, [loadFeed])
  );

  const onRefresh = useCallback(() => {
    void loadFeed(true);
  }, [loadFeed]);

  function openUrl(url: string): void {
    void Linking.openURL(url);
  }

  return (
    <ScreenContainer>
      {isTeacher ? (
        <View style={styles.teacherActions}>
          <AppButton title="Post Message" onPress={() => Alert.alert("Coming soon", "Message posting UI next step.")} />
          <View style={styles.spacer} />
          <AppButton
            title="Post Assignment"
            onPress={() =>
              (navigation as NativeStackScreenProps<TeacherStackParamList, "ClassFeed">["navigation"]).navigate(
                "CreateAssignment",
                {
                  classId: route.params.classId,
                  className: route.params.className
                }
              )
            }
          />
        </View>
      ) : null}

      {loading ? <Text style={styles.helper}>Loading feed...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!loading && !error ? (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.helper}>No posts yet.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.meta}>
                {item.creator.name ?? "Unknown"} • {item.creator.role}
              </Text>
              <Text style={styles.type}>{item.type}</Text>

              {item.contentText ? <Text style={styles.content}>{item.contentText}</Text> : null}

              {item.contentFileUrl ? (
                <Pressable onPress={() => openUrl(item.contentFileUrl)}>
                  <Text style={styles.link}>Open file</Text>
                </Pressable>
              ) : null}

              {item.contentAudioUrl ? (
                <Pressable onPress={() => openUrl(item.contentAudioUrl)}>
                  <Text style={styles.link}>Open audio</Text>
                </Pressable>
              ) : null}

              {item.type === "ASSIGNMENT" ? (
                <View style={styles.assignmentBlock}>
                  {item.assignment ? <Text style={styles.assignmentTitle}>{item.assignment.title}</Text> : null}
                  {isTeacher ? (
                    <AppButton
                      title="View Submissions"
                      onPress={() => {
                        if (!item.assignment) {
                          Alert.alert("Missing assignment", "Assignment details are not available for this post.");
                          return;
                        }
                        (
                          navigation as NativeStackScreenProps<TeacherStackParamList, "ClassFeed">["navigation"]
                        ).navigate("Submissions", {
                          assignmentId: item.assignment.id,
                          classId: route.params.classId,
                          className: route.params.className,
                          assignmentTitle: item.assignment.title
                        });
                      }}
                    />
                  ) : (
                    <AppButton
                      title="Submit Work"
                      onPress={() => {
                        if (!item.assignment) {
                          Alert.alert("Missing assignment", "Assignment details are not available for this post.");
                          return;
                        }
                        (
                          navigation as NativeStackScreenProps<StudentStackParamList, "ClassFeed">["navigation"]
                        ).navigate("SubmitWork", {
                          assignmentId: item.assignment.id,
                          classId: route.params.classId,
                          className: route.params.className
                        });
                      }}
                    />
                  )}
                </View>
              ) : null}
            </View>
          )}
        />
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  teacherActions: {
    marginBottom: 12
  },
  spacer: {
    height: 8
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
  meta: {
    fontSize: 12,
    color: "#667085",
    marginBottom: 6
  },
  type: {
    fontWeight: "700",
    color: "#101828",
    marginBottom: 6
  },
  content: {
    color: "#344054"
  },
  link: {
    color: "#155eef",
    marginTop: 6
  },
  assignmentBlock: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eaecf0",
    paddingTop: 10
  },
  assignmentTitle: {
    fontWeight: "600",
    color: "#101828",
    marginBottom: 8
  }
});
