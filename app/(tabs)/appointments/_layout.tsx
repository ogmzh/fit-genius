import { Stack } from "expo-router";

export default function AppointmentStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "Appointments",
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[appointment]" />
      <Stack.Screen name="details" />
    </Stack>
  );
}
