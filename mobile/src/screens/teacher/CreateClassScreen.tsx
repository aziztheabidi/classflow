import React, { useEffect, useState } from "react";
import { Alert, Pressable, Share, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createClass } from "../../api/classes.api";
import { getMySchools, type SchoolItem } from "../../api/schools.api";
import { AppButton } from "../../components/AppButton";
import { AppInput } from "../../components/AppInput";
import { ScreenContainer } from "../../components/ScreenContainer";
import type { TeacherStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../store/auth.store";

type Props = NativeStackScreenProps<TeacherStackParamList, "CreateClass">;

export function CreateClassScreen({ navigation }: Props): React.JSX.Element {
  const token = useAuthStore((state) => state.token);

  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [className, setClassName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSchools(): Promise<void> {
      if (!token) return;
      try {
        setLoadingSchools(true);
        const response = await getMySchools(token);
        setSchools(response.schools);
        if (response.schools.length > 0) {
          setSelectedSchoolId(response.schools[0].id);
        }
      } catch (apiError) {
        setError(apiError instanceof Error ? apiError.message : "Failed to load schools.");
      } finally {
        setLoadingSchools(false);
      }
    }

    void loadSchools();
  }, [token]);

  async function handleCreateClass(): Promise<void> {
    if (!token) return;
    if (!selectedSchoolId) {
      setError("Please create or select a school first.");
      return;
    }
    if (!className.trim()) {
      setError("Class name is required.");
      return;
    }

    try {
      setLoadingCreate(true);
      setError("");
      const response = await createClass(token, {
        schoolId: selectedSchoolId,
        name: className.trim()
      });
      setJoinCode(response.class.joinCode);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Failed to create class.");
    } finally {
      setLoadingCreate(false);
    }
  }

  async function handleShareCode(): Promise<void> {
    if (!joinCode) return;
    await Share.share({
      message: `Join my class using this code: ${joinCode}`
    });
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Create Class</Text>
      <Text style={styles.subtitle}>Pick one of your schools and create a class.</Text>

      <Text style={styles.label}>School</Text>
      {loadingSchools ? (
        <Text style={styles.helper}>Loading schools...</Text>
      ) : schools.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.helper}>No schools found. Create one first.</Text>
          <AppButton title="Go To Create School" onPress={() => navigation.navigate("CreateSchool")} />
        </View>
      ) : (
        <View style={styles.schoolList}>
          {schools.map((school) => (
            <Pressable
              key={school.id}
              style={[styles.schoolItem, selectedSchoolId === school.id && styles.schoolItemActive]}
              onPress={() => setSelectedSchoolId(school.id)}
            >
              <Text style={styles.schoolName}>{school.name}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <AppInput label="Class Name" value={className} onChangeText={setClassName} placeholder="Grade 7 - Section A" />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.footer}>
        <AppButton title={loadingCreate ? "Creating..." : "Create Class"} onPress={handleCreateClass} disabled={loadingCreate} />
      </View>

      {joinCode ? (
        <View style={styles.joinCodeBox}>
          <Text style={styles.joinCodeLabel}>Join Code</Text>
          <Text style={styles.joinCodeValue}>{joinCode}</Text>
          <AppButton title="Share Join Code" onPress={handleShareCode} />
        </View>
      ) : null}
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
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#344054",
    marginBottom: 8
  },
  helper: {
    color: "#667085",
    marginBottom: 12
  },
  empty: {
    marginBottom: 16
  },
  schoolList: {
    marginBottom: 16,
    gap: 8
  },
  schoolItem: {
    borderWidth: 1,
    borderColor: "#d0d5dd",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  schoolItemActive: {
    borderColor: "#155eef",
    backgroundColor: "#eef4ff"
  },
  schoolName: {
    color: "#101828",
    fontWeight: "500"
  },
  error: {
    color: "#b42318",
    marginTop: 4
  },
  footer: {
    marginTop: 12
  },
  joinCodeBox: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#b2ddff",
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 12
  },
  joinCodeLabel: {
    color: "#026aa2",
    fontWeight: "600",
    marginBottom: 6
  },
  joinCodeValue: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#0b4a6f",
    marginBottom: 10
  }
});
