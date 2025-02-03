import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  ImageSourcePropType,
} from "react-native";
import { icons } from "@/constants";
import { router } from "expo-router";
import { useLocationStore } from "@/store";

type LocationData = {
  lat: number;
  lon: number;
  formatted: string;
};

const AutocompleteTextInput = ({
  placeholderText,
  leftIcon,
  rightIcon,
  handleLocation,
}: {
  placeholderText?: string;
  leftIcon?: ImageSourcePropType;
  rightIcon?: ImageSourcePropType;
  handleLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}) => {
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<LocationData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchLocations = useCallback(async (text: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          text
        )}&filter=countrycode:eg&format=json&apiKey=${
          process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY
        }`
      );
      const locationList = await response.json();
      setData(locationList.results || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = useCallback(
    (text: string) => {
      setQuery(text);
      if (text.length >= 2) {
        fetchLocations(text); // Trigger fetch only for queries with 2+ characters
      } else {
        setData([]);
      }
    },
    [fetchLocations]
  );

  const handleLocationSelect = useCallback(
    (location: LocationData) => {
      setQuery(location.formatted);
      handleLocation({
        latitude: location.lat,
        longitude: location.lon,
        address: location.formatted,
      });
      setData(null);
      router.push("/(root)/find-ride");
    },
    [handleLocation]
  );

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#EBEBEB",
          backgroundColor: "white",
          paddingVertical: 8,
          shadowColor: "#ccc",
          shadowOpacity: 0.3,
          shadowOffset: { width: 0, height: 2 },
          elevation: 4,
        }}
      >
        <Image
          source={leftIcon || icons.search}
          style={{ width: 24, height: 24, marginHorizontal: 16 }}
          resizeMode="contain"
        />
        <TextInput
          style={{
            flex: 1,
            fontSize: 14,
            fontWeight: "400",
          }}
          placeholder={
            placeholderText
              ? `${placeholderText?.slice(0, 20)}...`
              : "Where do you want to go?"
          }
          value={query}
          onChangeText={handleInputChange}
        />
        {rightIcon && (
          <Image
            source={rightIcon}
            style={{
              width: 24,
              height: 24,
              marginHorizontal: 16,
            }}
            resizeMode="contain"
          />
        )}
      </View>

      {isLoading && (
        <ActivityIndicator
          style={{ marginVertical: 10 }}
          size="small"
          color="#888"
        />
      )}

      <FlatList
        data={data}
        style={{
          borderRadius: 10,
          borderWidth: data && data.length - 1 ? 0 : 1,
          borderColor: "#EBEBEB",
          backgroundColor: "white",
          shadowColor: "#ccc",
          shadowOpacity: 0.3,
          shadowOffset: { width: 0, height: 2 },
          elevation: 4,
        }}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => handleLocationSelect(item ?? {})}
            style={{
              padding: 10,
              borderBottomWidth: data && index === data.length - 1 ? 0 : 1,
              borderColor: "#eee",
            }}
          >
            <Text>{item.formatted || "Unnamed location"}</Text>
          </Pressable>
        )}
        keyExtractor={(item, index) => `${item.lat}-${item.lon}-${index}`}
        ListEmptyComponent={
          !isLoading && query.length >= 2 && data ? (
            <Text style={{ margin: 10, color: "#888" }}>No results found</Text>
          ) : null
        }
      />
    </View>
  );
};

export default AutocompleteTextInput;
