import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import type {
  Album,
  Artist,
  SimplifiedAlbum,
  SimplifiedTrack,
} from "@spotify/web-api-ts-sdk";
import { useQuery } from "@tanstack/react-query";
import {
  useLocalSearchParams,
  useGlobalSearchParams,
  router,
} from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  Platform,
  ScrollView,
  Pressable,
  FlatList,
} from "react-native";

export default function AlbumPage() {
  const { id } = useLocalSearchParams(); // Extract the dynamic ID from the route
  const { data } = useGlobalSearchParams();
  const [album] = useState(JSON.parse(data as string) as SimplifiedAlbum);

  const artist = useQuery({
    queryKey: ["artist", album.artists[0].id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_ADDR}/api/artist?id=${album.artists[0].id}`
      );
      return (await response.json()) as Artist;
    },
  });

  const tracks = useQuery({
    queryKey: ["album", album.artists[0].id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_ADDR}/api/album?id=${album.id}`
      );
      return (await response.json()) as Album & { tracks: SimplifiedTrack[] };
    },
  });

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <ScrollView style={{ marginHorizontal: 16 }}>
        <Pressable onPress={() => router.back()}>
          <Ionicons
            size={28}
            color={"#1e1e1e"}
            name="chevron-back"
            style={{
              marginLeft: -7,
              marginTop: -3,
            }}
          />
        </Pressable>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            {/* Title */}
            <Text
              style={{
                fontSize: 40,
                fontWeight: "bold",
                maxWidth: 200,
              }}
            >
              {album.name}
            </Text>

            {/* Artist */}
            <Pressable
              style={{
                marginTop: 4,
                alignSelf: "flex-start",
                flexDirection: "row",
                gap: 8,
              }}
              onPress={() =>
                router.push({
                  // @ts-ignore
                  pathname: `/artist/${artist.id}`,
                  params: { data: JSON.stringify(artist) },
                })
              }
            >
              {artist.data ? (
                <Image
                  source={artist.data.images[0]}
                  // @ts-ignore
                  style={{
                    aspectRatio: 1,
                    borderRadius: "100%",
                    width: 30,
                    height: 30,
                  }}
                />
              ) : (
                <View
                  // @ts-ignore
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: "#e1e1e1",
                    borderRadius: "100%",
                  }}
                />
              )}
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "medium",
                  alignSelf: "center",
                }}
              >
                {album.artists[0].name}
              </Text>
            </Pressable>

            {/* Info */}
            <Text style={{ marginTop: 8 }}>
              {[
                "album",
                album.release_date,
                `${album.total_tracks} tracks`,
              ].join(" • ")}
            </Text>

            {/* Tags */}
            {/* <View>
              {album.genres.map(genre => (
                <Text key={genre} style={{ backgroundColor: "blue" }}>
                  {genre}
                </Text>
              ))}
            </View> */}
          </View>
          <Image
            source={{ uri: album.images[0].url }}
            style={{
              aspectRatio: 1,
              width: 160,
              borderRadius: 8,
              marginHorizontal: 16,
            }}
          />
        </View>

        <View style={{ paddingTop: 16 }} />
        <View style={{ gap: 6 }}>
          <Text>tracklist</Text>
          {tracks.data &&
            tracks.data.tracks.map((t, idx) => (
              <View key={t.id} style={{ flexDirection: "row", gap: 10 }}>
                <Text
                  style={{
                    fontWeight: "medium",
                    fontSize: 14,
                    color: "#898A8D",
                    alignSelf: "center",
                  }}
                >
                  {idx}
                </Text>
                <Text style={{ fontSize: 16, lineHeight: 22 }}>{t.name}</Text>
              </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
