import { SafeAreaView, Text, View } from "react-native";
import { Calendar, Mode } from "react-native-big-calendar";
import DropDownPicker from "react-native-dropdown-picker";
import { useState } from "react";

const events = [
  {
    title: "Meeting",
    start: new Date(2020, 1, 11, 10, 0),
    end: new Date(2020, 1, 11, 10, 30),
  },
  {
    title: "Coffee break",
    start: new Date(2020, 1, 11, 15, 45),
    end: new Date(2020, 1, 11, 16, 30),
  },
];

const modes: { value: Mode; label: string }[] = [
  { label: "3 days", value: "3days" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Day", value: "day" },
];

const ScheduleScreen = () => {
  const [mode, setMode] = useState<Mode>("day");

  const [open, setOpen] = useState(false);
  return (
    <SafeAreaView className="flex flex-1 py-4 bg-slate-100">
      <View className="flex flex-1 px-2 items-center w-max">
        <View className="flex items-center bg-red-200 flex-row z-10 px-10">
          <Text className="mr-2">Mode</Text>
          <DropDownPicker
            open={open}
            value={mode}
            items={modes}
            setOpen={setOpen}
            setValue={setMode}
          />
        </View>
        <Calendar events={events} height={100} mode={mode} />
        <Text>bye</Text>
      </View>
    </SafeAreaView>
  );
};

export default ScheduleScreen;
