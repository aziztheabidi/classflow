import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
};

export function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false
}: Props): React.JSX.Element {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    color: "#344054"
  },
  input: {
    borderWidth: 1,
    borderColor: "#d0d5dd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16
  }
});
