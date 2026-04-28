import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "../../components/ScreenContainer";

export function LoadingScreen(): React.JSX.Element {
  return (
    <ScreenContainer>
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#155eef" />
        <Text style={styles.text}>Loading...</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    marginTop: 12,
    color: "#344054"
  }
});
