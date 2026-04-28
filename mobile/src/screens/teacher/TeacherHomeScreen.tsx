import React, { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getMyClasses } from "../../api/classes.api";
import { ScreenContainer } from "../../components/ScreenContainer";
import { AppButton } from "../../components/AppButton";
import type { TeacherStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../store/auth.store";

type Props = NativeStackScreenProps<TeacherStackParamList, "TeacherHome">;
type MyClass = { classId: string; className: string; schoolId: string; schoolName: string; memberRole: string; joinCode: string };

export function TeacherHomeScreen({ navigation }: Props): React.JSX.Element {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [classes, setClasses] = useState<MyClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadClasses = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError("");
      const response = await getMyClasses(token);
      setClasses(response.classes);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Failed to load classes.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      void loadClasses();
    }, [loadClasses])
  );

  return (
    <ScreenContainer>
      <Text style={styles.title}>Teacher Dashboard</Text>
      <Text style={styles.subtitle}>Welcome, {user?.name ?? user?.phoneNumber}</Text>

      <View style={styles.actions}>
        <AppButton title="Create School" onPress={() => navigation.navigate("CreateSchool")} />
        <View style={styles.spacer} />
        <AppButton title="Create Class" onPress={() => navigation.navigate("CreateClass")} />
      </View>

      <Text style={styles.sectionTitle}>My Classes</Text>
      {loading ? <Text style={styles.helper}>Loading classes...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!loading && !error ? (
        <FlatList
          data={classes}
          keyExtractor={(item) => item.classId}
          ListEmptyComponent={<Text style={styles.helper}>No classes yet.</Text>}
          renderItem={({ item }) => (
            <Pressable
              style={styles.classCard}
              onPress={() =>
                navigation.navigate("ClassFeed", {
                  classId: item.classId,
                  className: item.className
                })
              }
            >
              <Text style={styles.className}>{item.className}</Text>
              <Text style={styles.classMeta}>
                {item.schoolName} • Join Code: {item.joinCode}
              </Text>
            </Pressable>
          )}
        />
      ) : null}

      <AppButton title="Sign out" onPress={clearAuth} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8
  },
  subtitle: {
    color: "#667085",
    marginBottom: 16
  },
  actions: {
    marginBottom: 16
  },
  spacer: {
    height: 8
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8
  },
  helper: {
    color: "#667085",
    marginBottom: 12
  },
  error: {
    color: "#b42318",
    marginBottom: 12
  },
  classCard: {
    borderWidth: 1,
    borderColor: "#d0d5dd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  className: {
    fontWeight: "600",
    marginBottom: 8
  },
  classMeta: {
    color: "#667085"
  }
});
