import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function NewScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">New</ThemedText>
      <ThemedText>This is a new screen.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
