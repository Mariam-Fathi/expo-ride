import { PaymentProps } from "@/types/type";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";

async function openPaymentModal(): Promise<void> {
  const { url } = await fetch("/api/hosted-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      custom_donation: "12.56",
    },
  }).then((res) => res.json());

  router.push(url);
}

export default function Payment({ fullName, email, amount }: PaymentProps) {
  return <TouchableOpacity onPress={openPaymentModal}></TouchableOpacity>;
}
