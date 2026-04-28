import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ClassFeedScreen } from "../screens/shared/ClassFeedScreen";
import { JoinClassScreen } from "../screens/student/JoinClassScreen";
import { SubmitWorkScreen } from "../screens/student/SubmitWorkScreen";
import { StudentHomeScreen } from "../screens/student/StudentHomeScreen";
import type { StudentStackParamList } from "./types";

const Stack = createNativeStackNavigator<StudentStackParamList>();

export function StudentStack(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="StudentHome" component={StudentHomeScreen} options={{ title: "Student" }} />
      <Stack.Screen name="JoinClass" component={JoinClassScreen} options={{ title: "Join Class" }} />
      <Stack.Screen
        name="ClassFeed"
        component={ClassFeedScreen}
        options={({ route }) => ({ title: route.params.className })}
      />
      <Stack.Screen name="SubmitWork" component={SubmitWorkScreen} options={{ title: "Submit Work" }} />
    </Stack.Navigator>
  );
}
