import { useLocalSearchParams, useNavigation } from "expo-router";
import { isEmpty } from "lodash-es";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Pressable, ScrollView } from "react-native";
import { Stack, XStack, YStack } from "tamagui";

import { zodResolver } from "@hookform/resolvers/zod";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import { ActionButton } from "../components/action-button";
import { BackdropSpinner } from "../components/backdrop-spinner";
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
      reset({ ...existingUser });
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
      <BackdropSpinner visible={isLoadingUpdate || isLoadingCreate} />
      <ScrollView>
        <FormProvider {...methods}>
          <YStack px="$4" gap="$2">
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
                  placeholder="cm"
                />
              </Stack>
              <Stack f={1}>
                <TextFormInput<ClientUserSchema>
                  name="weight"
                  label="Weight"
                  keyboardType="numeric"
                  placeholder="kg"
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
            <ActionButton
              label="Reset"
              disabled={isLoadingCreate || isLoadingUpdate}
              textColor="$text"
              backgroundColor={
                isLoadingCreate || isLoadingUpdate
                  ? "$backgroundDisabled"
                  : "$backgroundSoft"
              }
              pressStyleBackground="$backgroundSoftActive"
              onPress={() => reset()}
            />
            <ActionButton
              label="Confirm"
              backgroundColor={
                isLoadingCreate || isLoadingUpdate || !isValid
                  ? "$backgroundDisabled"
                  : "$primary"
              }
              textColor={
                isLoadingCreate || isLoadingUpdate || !isValid
                  ? "$textDisabled"
                  : "$text"
              }
              pressStyleBackground="$primaryActive"
              onPress={handleSubmit(onSubmit)}
              disabled={isLoadingCreate || isLoadingUpdate || !isValid}
            />
          </XStack>
        </FormProvider>
      </ScrollView>
    </ScreenContainer>
  );
}
