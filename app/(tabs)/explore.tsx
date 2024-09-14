import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  View,
  SafeAreaView,
  Animated,
  Text,
  TextInput,
} from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AnimatedHeader, { Header } from "@/components/navigation/AnimatedHeader";
import { useEffect, useRef, useState } from "react";
import SearchBar from "@/components/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { chunk } from "../util/chunks";
import { useDebounce } from "use-debounce";

export default function ExploreScreen() {
  const offset = useRef(new Animated.Value(0)).current;
  const [searchText, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(searchText, 300);
  const [cancelSearch, setCancelSearch] = useState(true);
  const { isPending, error, data } = useQuery({
    queryKey: ["trending"],
    queryFn: async () => {
      const response = await fetch(`http://172.20.10.2:3000/api/new`);
      return await response.json();
    },
  });
  const searchRes = useQuery({
    queryKey: ["search", debouncedSearch],
    queryFn: async () => {
      const response = await fetch(
        `http://172.20.10.2:3000/api/search?search=${debouncedSearch}`
      );
      return await response.json();
    },
    enabled: !!debouncedSearch,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* <AnimatedHeader animatedValue={offset} /> */}
      <Header />
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <SearchBar setSearch={setSearch} />
      </View>
      {!searchRes.data && (
        <ScrollView
          contentInset={{ bottom: 60 + 12 }}
          style={{
            flex: 1,
            // paddingTop: 12,
            paddingHorizontal: 16,
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: offset } } }],
            {
              useNativeDriver: false,
            }
          )}
        >
          {isPending && <ThemedText>Loading...</ThemedText>}
          {error && <ThemedText>Error: {error.message}</ThemedText>}
          {data && (
            <View style={{ gap: 12, paddingTop: 12 }}>
              {chunk(data, 3).map(d => (
                <View
                  key={d[0].id}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  {d.map(a => (
                    <Image
                      key={a.id}
                      source={{ uri: a.images[0].url }}
                      style={{ flex: 1, aspectRatio: 1, borderRadius: 8 }}
                    />
                  ))}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {searchRes.data && (
        <ScrollView style={{ paddingHorizontal: 24 }}>
          {searchRes.data.albums?.map(a => (
            <View
              key={a.id}
              style={{ flexDirection: "row", paddingVertical: 6, gap: 8 }}
            >
              <Image
                source={{ uri: a.images[0]?.url ?? "" }}
                style={{ width: "14%", aspectRatio: 1, borderRadius: 8 }}
              />
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>
                  {a.name}
                </Text>
                <Text style={{ fontSize: 14, fontWeight: "400" }}>
                  {a.artists.map(a => a.name).join(", ")} • {"Album"}
                </Text>
              </View>
            </View>
          ))}
          {searchRes.data.artists?.map(a => (
            <View
              key={a.id}
              style={{ flexDirection: "row", paddingVertical: 6, gap: 8 }}
            >
              <Image
                source={{ uri: a.images[0]?.url ?? "" }}
                style={{ width: "14%", aspectRatio: 1, borderRadius: 100 }}
              />
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>
                  {a.name}
                </Text>
                <Text style={{ fontSize: 14, fontWeight: "400" }}>
                  {"Artist"}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
