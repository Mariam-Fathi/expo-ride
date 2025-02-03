import { router } from "expo-router";
import { Text, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";
import AutocompleteTextInput from "@/components/AutocompleteTextInput";

const FindRide = () => {
  const {
    userAddress,
    destinationAddress,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();

  return (
    <RideLayout title="Ride">
      <View className="my-3">
        <Text className="text-lg font-JakartaSemiBold mb-3">From</Text>

        <AutocompleteTextInput
          placeholderText={userAddress || "From location"}
          leftIcon={icons.point}
          rightIcon={icons.target}
          handleLocation={setUserLocation}
        />
      </View>

      <View className="my-3">
        <Text className="text-lg font-JakartaSemiBold mb-3">To</Text>

        <AutocompleteTextInput
          placeholderText={destinationAddress || "To location"}
          leftIcon={icons.point}
          rightIcon={icons.map}
          handleLocation={setDestinationLocation}
        />
      </View>

      <CustomButton
        title="Find Now"
        onPress={() => router.push(`/(root)/confirm-ride`)}
        className="mt-5"
      />
    </RideLayout>
  );
};

export default FindRide;
