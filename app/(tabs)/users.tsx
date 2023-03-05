import { format, parse } from "date-fns";
import { useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import DatePicker from "react-native-date-picker";

import PressableButton from "../components/pressable-button";
import TextFormInput from "../components/text-form-input";
import { DATE_FORMAT } from "../shared/utils";

export default function TabOneScreen() {
  const [value, setValue] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState<string | null>(null);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date: Date) => {
    setDate(format(date, DATE_FORMAT));
    hideDatePicker();
  };

  return (
    <SafeAreaView className="flex flex-1 py-4 bg-primary-light dark:bg-primary-dark">
      <ScrollView className="flex flex-1 px-4 gap-y-6">
        <View>
          <TextFormInput
            onChange={setValue}
            value={value}
            label="First name"
          />
        </View>
        <View>
          <TextFormInput
            onChange={setValue}
            value={value}
            label="Last name"
          />
        </View>
        <View>
          <TextFormInput
            onChange={setValue}
            required
            value={value}
            keyboardType="email-address"
            label="Email"
            placeholder="email@domain.com"
          />
        </View>
        <View>
          <TextFormInput
            keyboardType="phone-pad"
            onChange={setValue}
            required
            value={value}
            label="Phone number"
            placeholder="+387655533221"
          />
        </View>
        <View className="flex flex-row gap-x-6">
          <View className="flex-1">
            <TextFormInput
              onChange={setValue}
              value={value}
              label="Height"
              keyboardType="numeric"
            />
          </View>
          <View className="flex-1">
            <TextFormInput
              onChange={setValue}
              value={value}
              label="Weight"
              keyboardType="numeric"
            />
          </View>
        </View>
        <View className="flex">
          <Text className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            Date of birth
          </Text>
          <Text
            onPress={showDatePicker}
            className={`bg-slate-50 border border-slate-300 ${
              date ? "text-gray-900" : "text-gray-400"
            } text-sm rounded-lg w-full py-3.5 px-2.5`}>
            {date ? date : "DD/MM/YYYY"}
          </Text>
          <DatePicker
            modal
            title={null}
            confirmText="CONFIRM"
            cancelText="CANCEL"
            mode="date"
            maximumDate={new Date()}
            date={date ? parse(date, DATE_FORMAT, new Date()) : new Date()}
            open={isDatePickerVisible}
            onConfirm={handleConfirmDate}
            onCancel={hideDatePicker}
          />
        </View>
        <View>
          <TextFormInput
            onChange={setValue}
            value={value}
            numberOfLines={4}
            label="Goals"
          />
        </View>
        <View>
          <TextFormInput
            onChange={setValue}
            value={value}
            numberOfLines={4}
            label="Notes"
          />
        </View>
        <View className="flex flex-row justify-around">
          <PressableButton
            type="secondary"
            label="Reset"
            onPress={() => console.log("press")}
          />
          <PressableButton
            type="primary"
            label="Confirm"
            onPress={() => console.log("press")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
