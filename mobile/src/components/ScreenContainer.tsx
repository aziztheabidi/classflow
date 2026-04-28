import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

type Props = {
  children: React.ReactNode;
};

export function ScreenContainer({ children }: Props): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  content: {
    flex: 1,
    padding: 16
  }
});
