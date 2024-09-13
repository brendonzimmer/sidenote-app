import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  ViewStyle,
  StyleProp,
  Animated,
  Pressable,
  Button,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SearchInput({ setSearch }: { setSearch: any }) {
  const offset = useRef(new Animated.Value(0)).current;
  const [showCancel, setShowCancel] = useState(false);

  return (
    <View style={{ flexDirection: "row" }}>
      <Animated.View
        style={[
          styles.container,
          {
            width: offset.interpolate({
              inputRange: [0, 1],
              outputRange: ["100%", "84%"],
              extrapolate: "clamp",
            }),
          },
        ]}
      >
        <Ionicons name="search" style={styles.icon} />
        <TextInput
          onChangeText={t => setSearch(t)}
          onPress={() => {
            Animated.timing(offset, {
              toValue: 1,
              duration: 300,
              useNativeDriver: false,
            }).start(() => setShowCancel(true));
          }}
          placeholder="Search an album, artist, etc."
          placeholderTextColor="#888"
          style={styles.input}
        />
      </Animated.View>
      {
        <Pressable
          style={{
            padding: 8,
            justifyContent: "center",
            alignItems: "center",
            width: "17%",
          }}
          onPress={() => {
            Animated.timing(offset, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }).start(() => setShowCancel(false));
          }}
        >
          <Animated.Text style={{ opacity: offset }}>Cancel</Animated.Text>
        </Pressable>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",

    borderRadius: 8,
    height: 36,
  },
  icon: {
    marginLeft: 8,
    marginRight: 4,
    // backgroundColor: "green",
    color: "#888",
    fontSize: 20,
  },
  input: {
    flex: 1,
    fontSize: 16, // Slightly smaller font size
    color: "#000",
    height: "100%",
    paddingVertical: 8,
    // backgroundColor: "red",
  },
});
