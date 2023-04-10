import { CalendarCheck, Users, Settings2 } from "@tamagui/lucide-icons";
import { Tabs } from "expo-router";
import { useTheme } from "tamagui";
import { useThemedHeaderProps } from "../../shared/hooks";

export default function TabLayout() {
  const { stackHeaderProps } = useThemedHeaderProps();
  const { accent, background, text } = useTheme();
  return (
    // TODO: add animations to the tabs (inspiration: expo go)
    <>
      <Tabs
        initialRouteName="appointments"
        screenOptions={{
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: accent.val,
          tabBarStyle: {
            backgroundColor: background.val,
            borderTopColor: background.val,
          },
          tabBarLabelStyle: {
            color: text.val,
          },
          ...stackHeaderProps,
        }}>
        <Tabs.Screen
          name="appointments"
          options={{
            title: "Appointments",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <CalendarCheck size="$2" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="clients"
          options={{
            title: "Clients",
            headerShown: false,
            tabBarIcon: ({ color }) => <Users size="$2" color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <Settings2 size="$2" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          // Name of the route to hide.
          name="index"
          options={{
            // This tab will no longer show up in the tab bar.
            href: null,
          }}
        />
      </Tabs>
    </>
  );
}
