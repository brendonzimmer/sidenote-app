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
  Pressable,
} from "react-native";

import type { Artist, SimplifiedAlbum } from "@spotify/web-api-ts-sdk";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AnimatedHeader, { Header } from "@/components/navigation/AnimatedHeader";
import { useEffect, useRef, useState } from "react";
import SearchBar from "@/components/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { chunk } from "../../util/chunks";
import { useDebounce } from "use-debounce";
import { router } from "expo-router";

export default function ExploreScreen() {
  const offset = useRef(new Animated.Value(0)).current;
  const [searchText, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(searchText, 300);
  const trending = useQuery({
    queryKey: ["trending"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_ADDR}/api/new`
      );
      return (await response.json()) as SimplifiedAlbum[];
    },
  });
  const search = useQuery({
    queryKey: ["search", debouncedSearch],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_ADDR}/api/search?search=${debouncedSearch}`
      );
      return (await response.json()) as {
        albums: SimplifiedAlbum[];
        artists: Artist[];
      };
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
      {!search.data && (
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
          {trending.isPending && <ThemedText>Loading...</ThemedText>}
          {trending.error && (
            <ThemedText>Error: {trending.error.message}</ThemedText>
          )}
          {trending.data && (
            <View style={{ gap: 12, paddingTop: 12 }}>
              {chunk(trending.data, 3).map(d => (
                <View
                  key={d.map(a => a.id).join(",")}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  {d.map(a => (
                    <Pressable
                      key={a.id}
                      style={{ flex: 1, aspectRatio: 1, borderRadius: 8 }}
                      onPress={() =>
                        router.push({
                          // @ts-ignore
                          pathname: `/album/${a.id}`,
                          params: {
                            data: JSON.stringify(a),
                          },
                        })
                      }
                    >
                      <Image
                        source={{ uri: a.images[0].url }}
                        style={{ flex: 1, aspectRatio: 1, borderRadius: 8 }}
                      />
                    </Pressable>
                  ))}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {search.data && (
        <ScrollView style={{ paddingHorizontal: 24 }}>
          {search.data.albums?.map(a => (
            <Pressable
              key={a.id}
              onPress={() =>
                router.push({
                  // @ts-ignore
                  pathname: `/album/${a.id}`,
                  params: {
                    data: JSON.stringify(a),
                  },
                })
              }
            >
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
            </Pressable>
          ))}
          {search.data.artists?.map(a => (
            <Pressable
              key={a.id}
              onPress={() =>
                router.push({
                  // @ts-ignore
                  pathname: `/artist/${a.id}`,
                  params: {
                    data: JSON.stringify(a),
                  },
                })
              }
            >
              <View
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
            </Pressable>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
