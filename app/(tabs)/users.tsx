import { format } from "date-fns";
import { useState } from "react";
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import DatePicker from "react-native-date-picker";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import PressableButton from "../components/pressable-button";
import TextFormInput from "../components/text-form-input";
import { DATE_FORMAT } from "../shared/utils";

const userSchema = z.object({
  firstName: z
    .string()
    .min(2, "Name is required")
    .max(50, "Name is too long"),
  lastName: z
    .string()
    .min(2, "Name is required")
    .max(50, "Name is too long"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z
    .string()
    .min(6, "Phone number is too short")
    .optional()
    .or(z.literal("")),
  height: z.coerce
    .number()
    .min(100, "Height in cm")
    .max(250, "Height in cm")
    .optional()
    .or(z.literal("")),
  weight: z.coerce
    .number()
    .min(20, "Weight in kg")
    .max(500, "Weight in kg")
    .optional()
    .or(z.literal("")),
  dateOfBirth: z.date().optional(),
  goals: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof userSchema>;

export default function TabOneScreen() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const { ...methods } = useForm<FormValues>({
    resolver: zodResolver(userSchema),
    reValidateMode: "onSubmit",
  });

  const { watch, setValue, handleSubmit } = methods;

  const date = watch("dateOfBirth");

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date: Date) => {
    setValue("dateOfBirth", date);

    hideDatePicker();
  };

  const onSubmit: SubmitHandler<FormValues> = data => {
    console.log({ data });
  };

  const onError: SubmitErrorHandler<FormValues> = (errors, e) => {
    return console.log(errors);
  };

  return (
    <SafeAreaView className="flex flex-1 py-4 bg-primary-light dark:bg-primary-dark">
      <FormProvider {...methods}>
        <ScrollView className="flex flex-1 px-4 gap-y-6">
          <View>
            <TextFormInput name="firstName" required label="First name" />
          </View>
          <View>
            <TextFormInput name="lastName" required label="Last name" />
          </View>
          <View>
            <TextFormInput
              name="email"
              keyboardType="email-address"
              label="Email"
              placeholder="email@domain.com"
            />
          </View>
          <View>
            <TextFormInput
              name="phone"
              keyboardType="phone-pad"
              label="Phone number"
              placeholder="+387655533221"
            />
          </View>
          <View className="flex flex-row gap-x-6">
            <View className="flex-1">
              <TextFormInput
                name="height"
                label="Height"
                keyboardType="numeric"
              />
            </View>
            <View className="flex-1">
              <TextFormInput
                name="weight"
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
              {date ? format(date, DATE_FORMAT) : "DD/MM/YYYY"}
            </Text>
            <DatePicker
              modal
              title={null}
              confirmText="CONFIRM"
              cancelText="CANCEL"
              mode="date"
              maximumDate={new Date()}
              date={date ? date : new Date()}
              open={isDatePickerVisible}
              onConfirm={handleConfirmDate}
              onCancel={hideDatePicker}
            />
          </View>
          <View>
            <TextFormInput name="goals" numberOfLines={4} label="Goals" />
          </View>
          <View>
            <TextFormInput name="notes" numberOfLines={4} label="Notes" />
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
              onPress={handleSubmit(onSubmit, onError)}
            />
          </View>
        </ScrollView>
      </FormProvider>
    </SafeAreaView>
  );
}
