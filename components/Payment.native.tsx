import { useStripe } from "@stripe/stripe-react-native";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";
import { fetchAPI } from "@/lib/fetch";
import { PaymentProps } from "@/types/type";
import * as Linking from "expo-linking";
import CustomButton from "./CustomButton";
import { images } from "@/constants";

const Payment = ({ fullName, email, amount }: PaymentProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [success, setSuccess] = useState<boolean>(false);

  const openPaymentSheet = async () => {
    await initializePaymentSheet();

    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      setSuccess(true);
    }
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, customer, ephemeralKey } = await fetchAPI(
      "/(api)/payment-sheet",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email: email,
          amount: amount,
        }),
      }
    );

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Expo, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      defaultBillingDetails: {
        name: fullName,
        email: email,
        phone: "000-000-000",
      },
      returnURL: Linking.createURL("(root)/(tabs)/home"),
    });
  };

  return (
    <>
      <TouchableOpacity
        onPress={openPaymentSheet}
        className="w-full rounded-full py-4 flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 bg-[#0286FF]"
      >
        <Text className="text-white text-lg text-center font-rubik-bold">
          Book Now
        </Text>
      </TouchableOpacity>
      <ReactNativeModal
        isVisible={success}
        onBackdropPress={() => setSuccess(false)}
      >
        <View className="flex flex-col items-center justify-center bg-white p-7 rounded-2xl">
          <Image source={images.check} className="w-28 h-28 mt-5" />

          <Text className="text-2xl text-center font-JakartaBold mt-5">
            Booking placed successfully
          </Text>

          <Text className="text-md text-general-200 font-JakartaRegular text-center mt-3">
            Thank you for your booking. Your ride has been successfully placed.
          </Text>

          <CustomButton
            title="Back Home"
            onPress={() => {
              setSuccess(false);
              router.push("/(root)/(tabs)/home");
            }}
            className="mt-5"
          />
        </View>
      </ReactNativeModal>
    </>
  );
};

export default Payment;
