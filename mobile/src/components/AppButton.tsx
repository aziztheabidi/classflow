import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export function AppButton({ title, onPress, disabled = false }: Props): React.JSX.Element {
  return (
    <Pressable style={[styles.button, disabled && styles.disabled]} onPress={onPress} disabled={disabled}>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#155eef",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center"
  },
  disabled: {
    opacity: 0.5
  },
  title: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600"
  }
});
