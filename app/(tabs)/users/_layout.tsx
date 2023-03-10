import { Stack } from "expo-router";

export default function UsersLayout() {
  return (
    <Stack
      initialRouteName="user-list"
      screenOptions={{
        headerShown: true,
        headerTitle: "Clients",
      }}>
      <Stack.Screen name="user-list" />
      <Stack.Screen name="user-form" />
    </Stack>
  );
}
