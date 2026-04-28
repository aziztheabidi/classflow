import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { UserRole } from "../types/auth";

type Props = {
  value: UserRole;
  onChange: (role: UserRole) => void;
};

export function RoleSwitch({ value, onChange }: Props): React.JSX.Element {
  return (
    <View style={styles.row}>
      {(["TEACHER", "STUDENT"] as const).map((role) => (
        <Pressable
          key={role}
          style={[styles.item, value === role && styles.itemActive]}
          onPress={() => onChange(role)}
        >
          <Text style={[styles.text, value === role && styles.textActive]}>{role}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8
  },
  item: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d0d5dd",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center"
  },
  itemActive: {
    backgroundColor: "#eef4ff",
    borderColor: "#155eef"
  },
  text: {
    color: "#344054",
    fontWeight: "500"
  },
  textActive: {
    color: "#155eef"
  }
});
