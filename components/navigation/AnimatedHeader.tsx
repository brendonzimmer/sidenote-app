import { Animated, SafeAreaView, Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBarIcon } from "./TabBarIcon";
import { ThemedView } from "../ThemedView";
import SearchBar from "../SearchBar";

const HEADER_HEIGHT = 50;

export default function AnimatedHeader({
  animatedValue,
}: {
  animatedValue: Animated.Value;
}) {
  const insets = useSafeAreaInsets();

  const headerHeight = animatedValue.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [HEADER_HEIGHT + insets.top, insets.top],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        height: headerHeight,
        backgroundColor: "#ffffff",
        borderBottomWidth: animatedValue.interpolate({
          inputRange: [0, HEADER_HEIGHT],
          outputRange: [0.5, 0],
          extrapolate: "clamp",
        }),
        borderBottomColor: "#e0e0e0",
      }}
    >
      <Animated.View
        style={{
          justifyContent: "space-between",
          opacity: animatedValue.interpolate({
            inputRange: [0, HEADER_HEIGHT],
            outputRange: [1, 0],
            extrapolate: "clamp",
          }),
          position: "absolute",
          top: animatedValue.interpolate({
            inputRange: [0, HEADER_HEIGHT],
            outputRange: [insets.top - 10, 0],
            extrapolate: "clamp",
          }),
          left: 16,
          right: 16,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Animated.Image
          source={require("@/assets/images/logo.png")}
          style={{
            width: 100,
            height: 60,
          }}
        />
        <TabBarIcon name="notifications-outline" />
      </Animated.View>
    </Animated.View>
  );
}

export function Header() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        zIndex: 10,
        height: HEADER_HEIGHT,
        backgroundColor: "#ffffff",
        borderBottomWidth: 0.25,
        borderBottomColor: "#e0e0e0",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 10,
      }}
    >
      <Image
        source={require("@/assets/images/logo.png")}
        style={{
          width: 100,
          height: 60,
        }}
      />
      <TabBarIcon name="notifications-outline" />
    </View>
  );
}
