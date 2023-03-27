import { useLocalSearchParams, useNavigation } from "expo-router";
import { isEmpty } from "lodash-es";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Pressable, ScrollView } from "react-native";
import { Button, Stack, XStack, YStack } from "tamagui";

import { zodResolver } from "@hookform/resolvers/zod";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import ScreenContainer from "../components/screen-container";
import TextFormInput from "../components/text-form-input";
import { useMutateUsers, useUser } from "../queries/clients";
import HttpStatusCode from "../shared/http-status-codes";
import { HUMAN_DATE_FORMAT } from "../shared/utils";
import {
  ClientUserSchema,
  clientUserSchema,
} from "../shared/validation/client";

export default function ClientUserFormScreen() {
  const { canGoBack, goBack } = useNavigation();

  // represents the [user] (actually, id) matched in the file name
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: existingUser } = useUser(id);

  const { createAsync, updateAsync, isLoadingUpdate, isLoadingCreate } =
    useMutateUsers();

  const isEditing = !!id && !!existingUser;

  const methods = useForm<ClientUserSchema>({
    resolver: zodResolver(clientUserSchema),
    defaultValues: isEditing && existingUser ? { ...existingUser } : {},
    reValidateMode: "onSubmit",
  });

  const { watch, setValue, handleSubmit, setError, reset, formState } =
    methods;
  const { isValid, defaultValues } = formState;

  useEffect(() => {
    if (id && existingUser && isEmpty(defaultValues)) {
      methods.reset({ ...existingUser });
    }
  }, [id, existingUser]);

  const dateOfBirth = watch("dateOfBirth");

  const onSubmit: SubmitHandler<ClientUserSchema> = async data => {
    const response = isEditing
      ? await updateAsync({ data, id })
      : await createAsync(data);

    if (
      !(
        response.status === HttpStatusCode.CREATED ||
        response.status === HttpStatusCode.NO_CONTENT
      )
    ) {
      console.warn(response.error?.message);
    }

    if (response?.error) {
      if (response.status === HttpStatusCode.CONFLICT) {
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
    } else {
      reset();
      canGoBack() && goBack();
    }
  };

  return (
    <ScreenContainer>
      <ScrollView>
        <FormProvider {...methods}>
          <YStack f={1} px="$4" gap="$2">
            <TextFormInput<ClientUserSchema>
              name="firstName"
              required
              label="First name"
              placeholder="First name"
            />
            <TextFormInput<ClientUserSchema>
              name="lastName"
              required
              label="Last name"
              placeholder="Last name"
            />
            <TextFormInput<ClientUserSchema>
              name="email"
              keyboardType="email-address"
              label="Email"
              placeholder="email@domain.com"
            />
            <TextFormInput<ClientUserSchema>
              name="phoneNumber"
              keyboardType="phone-pad"
              label="Phone number"
              placeholder="+387655533221"
            />
            <XStack gap="$4">
              <Stack f={1}>
                <TextFormInput<ClientUserSchema>
                  name="height"
                  label="Height"
                  keyboardType="numeric"
                  placeholder="174 cm"
                />
              </Stack>
              <Stack f={1}>
                <TextFormInput<ClientUserSchema>
                  name="weight"
                  label="Weight"
                  keyboardType="numeric"
                  placeholder="71 kg"
                />
              </Stack>
            </XStack>
            <Pressable
              onPress={() => {
                //TODO: implement for iOS
                DateTimePickerAndroid.open({
                  value: (dateOfBirth ?? new Date()) as Date,
                  maximumDate: new Date(),
                  onChange: (_, date) => {
                    setValue("dateOfBirth", date);
                  },
                  mode: "date",
                });
              }}>
              <TextFormInput<ClientUserSchema>
                name="dateOfBirth"
                label="Date of Birth"
                dateFormatter={dateOfBirth ? HUMAN_DATE_FORMAT : undefined}
                disabled
                placeholder={HUMAN_DATE_FORMAT}
              />
            </Pressable>
            <TextFormInput<ClientUserSchema>
              name="goals"
              numberOfLines={4}
              label="Goals"
            />
            <TextFormInput<ClientUserSchema>
              name="notes"
              numberOfLines={4}
              label="Notes"
            />
          </YStack>
          <XStack jc="center" my="$4" gap="$4">
            <Button
              w="$10"
              pressStyle={{ bg: "$secondarySoft" }}
              color="$textSoft"
              bg={
                isLoadingCreate || isLoadingUpdate
                  ? "$backgroundDisabled"
                  : "$backgroundSoft"
              }
              disabled={isLoadingCreate || isLoadingUpdate}
              onPress={() => reset()}>
              Reset
            </Button>
            <Button
              w="$10"
              bg={
                isLoadingCreate || isLoadingUpdate || !isValid
                  ? "$backgroundDisabled"
                  : "$primary"
              }
              color={
                isLoadingCreate || isLoadingUpdate || !isValid
                  ? "$textDisabled"
                  : "$buttonText"
              }
              pressStyle={{ bg: "$primarySoft" }}
              disabled={isLoadingCreate || isLoadingUpdate || !isValid}
              onPress={handleSubmit(onSubmit)}>
              Confirm
            </Button>
          </XStack>
        </FormProvider>
      </ScrollView>
    </ScreenContainer>
  );
}
