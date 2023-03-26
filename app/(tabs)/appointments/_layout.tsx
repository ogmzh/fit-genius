import { Stack } from "expo-router";
import { useThemedHeaderProps } from "../../../shared/hooks";

export default function AppointmentStack() {
  const { stackHeaderProps } = useThemedHeaderProps();

  return (
    <Stack
      screenOptions={{
        headerTitle: "Appointments",
        ...stackHeaderProps,
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[appointment]" />
      <Stack.Screen name="details" />
    </Stack>
  );
}
