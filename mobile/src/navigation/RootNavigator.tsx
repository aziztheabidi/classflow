import React from "react";
import { AuthStack } from "./AuthStack";
import { StudentStack } from "./StudentStack";
import { TeacherStack } from "./TeacherStack";
import { useAuthStore } from "../store/auth.store";
import { LoadingScreen } from "../screens/shared/LoadingScreen";

export function RootNavigator(): React.JSX.Element {
  const hydrated = useAuthStore((state) => state.hydrated);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  if (!hydrated) {
    return <LoadingScreen />;
  }

  if (!token || !user) {
    return <AuthStack />;
  }

  if (user.role === "TEACHER") {
    return <TeacherStack />;
  }

  return <StudentStack />;
}
