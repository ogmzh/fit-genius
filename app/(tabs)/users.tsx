import { format, formatISO } from "date-fns";
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
import HttpStatusCode from "../shared/http-status-codes";
import { useSupabase } from "../shared/supabase.provider";
import DatabaseTables from "../shared/types/db";
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
  phoneNumber: z
    .string()
    .min(6, "Phone number is too short")
    .optional()
    .or(z.literal("")),
  height: z
    .number({
      coerce: true,
      errorMap: () => ({
        message: "Invalid number format",
      }),
    })
    .min(100, "Too low value")
    .max(250, "Too high value")
    .optional()
    .or(z.literal("")),
  weight: z
    .number({
      coerce: true,
      errorMap: () => ({
        message: "Invalid number format",
      }),
    })
    .min(20, "Too low value")
    .max(500, "Too high value")
    .optional()
    .or(z.literal("")),
  dateOfBirth: z.date().optional(),
  goals: z.string().optional().nullable(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof userSchema>;

export default function TabOneScreen() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const { queryBuilder, client } = useSupabase();

  const { ...methods } = useForm<FormValues>({
    resolver: zodResolver(userSchema),
    reValidateMode: "onSubmit",
  });

  const { watch, setValue, handleSubmit, setError } = methods;

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

  const onSubmit: SubmitHandler<FormValues> = async data => {
    if (queryBuilder) {
      const response = await queryBuilder(DatabaseTables.CLIENTS).insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email || null,
        phone_number: data.phoneNumber || null,
        height:
          data.height && typeof data.height === "number"
            ? Number(data.height)
            : null,
        weight:
          data.weight && typeof data.weight === "number"
            ? Number(data.weight)
            : null,
        date_of_birth: data.dateOfBirth
          ? formatISO(data.dateOfBirth)
          : null,
        goals: data.goals || null,
        notes: data.notes || null,
      });
      if (response.status !== HttpStatusCode.CREATED) {
        console.warn(response.error?.message);
      }
      if (response?.error) {
        if (response.status === HttpStatusCode.CONFLICT) {
          console.log("hello error", response.error);
          if (response.error.message.includes("email_key")) {
            setError(
              "email",
              {
                message: "Email already exists",
              },
              { shouldFocus: true }
            );
          }
          if (response.error.message.includes("phone_number_key")) {
            setError(
              "phoneNumber",
              {
                message: "Phone already exists",
              },
              { shouldFocus: true }
            );
          }
        }
      }
    }
  };

  async function gitSumUsers() {
    if (client) {
      const resp = await client
        .from("clients")
        .select("*", { count: "exact" });
      console.log("response", resp.count);
    }
  }

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
              name="phoneNumber"
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
              onPress={() => gitSumUsers()}
            />
            <PressableButton
              type="primary"
              label="Confirm"
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </ScrollView>
      </FormProvider>
    </SafeAreaView>
  );
}
