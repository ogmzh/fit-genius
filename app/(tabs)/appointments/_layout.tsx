import { Stack } from "expo-router";
import { useThemedHeaderProps } from "../../../shared/hooks";

export default function AppointmentStack() {
  const { stackHeaderProps } = useThemedHeaderProps();

  return (
    <Stack
      initialRouteName="calendar"
      screenOptions={{
        headerTitle: "Appointments",
        ...stackHeaderProps,
      }}>
      <Stack.Screen name="new" />
      <Stack.Screen name="calendar" />
    </Stack>
  );
}
