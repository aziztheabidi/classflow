import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CreateAssignmentScreen } from "../screens/teacher/CreateAssignmentScreen";
import { CreateClassScreen } from "../screens/teacher/CreateClassScreen";
import { CreateSchoolScreen } from "../screens/teacher/CreateSchoolScreen";
import { ReviewSubmissionScreen } from "../screens/teacher/ReviewSubmissionScreen";
import { SubmissionsScreen } from "../screens/teacher/SubmissionsScreen";
import { ClassFeedScreen } from "../screens/shared/ClassFeedScreen";
import { TeacherHomeScreen } from "../screens/teacher/TeacherHomeScreen";
import type { TeacherStackParamList } from "./types";

const Stack = createNativeStackNavigator<TeacherStackParamList>();

export function TeacherStack(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TeacherHome" component={TeacherHomeScreen} options={{ title: "Teacher" }} />
      <Stack.Screen name="CreateSchool" component={CreateSchoolScreen} options={{ title: "Create School" }} />
      <Stack.Screen name="CreateClass" component={CreateClassScreen} options={{ title: "Create Class" }} />
      <Stack.Screen name="CreateAssignment" component={CreateAssignmentScreen} options={{ title: "Create Assignment" }} />
      <Stack.Screen name="Submissions" component={SubmissionsScreen} options={{ title: "Submissions" }} />
      <Stack.Screen name="ReviewSubmission" component={ReviewSubmissionScreen} options={{ title: "Review Submission" }} />
      <Stack.Screen
        name="ClassFeed"
        component={ClassFeedScreen}
        options={({ route }) => ({ title: route.params.className })}
      />
    </Stack.Navigator>
  );
}
