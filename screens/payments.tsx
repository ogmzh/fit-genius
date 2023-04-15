import { H4, Input, Paragraph, Spinner, XStack, YStack } from "tamagui";
import ScreenContainer from "../components/screen-container";
import { FloatingActionButton } from "../components/floating-action-button";
import { useEffect, useState } from "react";
import { BottomSheet } from "../components/sheet/bottom-sheet";
import { SheetControls } from "../components/sheet/sheet-controls";
import { useLocalSearchParams } from "expo-router";
import { ThumbSwitch } from "../components/thumb-switch";
import { useMutatePayments, usePayments } from "../queries/payments";
import { useMutateUsers, useUser } from "../queries/clients";
import HttpStatusCode from "../shared/http-status-codes";

export const Payments = () => {
  const [showSheet, setShowSheet] = useState(false);

  const [newWorkouts, setNewWorkouts] = useState("12");

  const [error, setError] = useState("");
  const [solo, setSolo] = useState(false);

  const { id: userId } = useLocalSearchParams<{ id: string }>();

  const { data: user } = useUser(userId);

  const { data: payments, isLoading } = usePayments(userId);
  const {
    createAsync: createPaymentAsync,
    isLoading: isMutatingPayments,
    deleteAsync: deletePaymentAsync,
    isLoadingDelete: isDeletingPayment,
  } = useMutatePayments();
  const {
    updateFieldAsync: updateClientFieldAsync,
    isLoadingUpdateField: isMutatingUser,
  } = useMutateUsers();

  const isMutating =
    isMutatingPayments || isMutatingUser || isDeletingPayment;

  useEffect(() => {
    if (newWorkouts) {
      if (
        !Number.isInteger(Number.parseInt(newWorkouts)) ||
        Number.isNaN(Number.parseInt(newWorkouts))
      ) {
        setError("Please enter a valid number");
      }
      if (Number.parseInt(newWorkouts) < 1) {
        setError("Please enter a number greater than 0");
      }
    }
  }, [newWorkouts]);

  const confirm = async () => {
    const paymentResponse = await createPaymentAsync({
      isSolo: solo,
      userId: userId!,
      workouts: Number.parseInt(newWorkouts),
    });

    if (paymentResponse.status === HttpStatusCode.CREATED) {
      const clientUpdateResponse = await updateClientFieldAsync({
        id: userId!,
        field: solo ? "workouts_solo" : "workouts_group",
        value: solo
          ? Number.parseInt(newWorkouts) + (user?.workoutsSolo ?? 0)
          : Number.parseInt(newWorkouts) + (user?.workoutsGroup ?? 0),
      });
      if (
        clientUpdateResponse.status !== HttpStatusCode.NO_CONTENT &&
        paymentResponse.data
      ) {
        await deletePaymentAsync(paymentResponse.data[0].id);
      }
    }
    reset();
  };

  const reset = () => {
    setNewWorkouts("12");
    setError("");
    setSolo(false);
    setShowSheet(false);
  };

  const soloWorkouts = user?.workoutsSolo ?? 0;
  const groupWorkouts = user?.workoutsGroup ?? 0;
  return (
    <ScreenContainer>
      <YStack ai="center">
        <H4 mb="$3">
          {user?.firstName} {user?.lastName}
        </H4>
        <XStack
          mt="$2"
          w="80%"
          bg="$backgroundSoft"
          jc="space-between"
          ai="center"
          px="$6"
          py="$4"
          bw="$0.5"
          br="$3"
          boc="$backgroundSoftActive">
          <YStack ai="center" f={1}>
            <Paragraph mb="$2" fontSize="$5">
              Workouts remaining:
            </Paragraph>
            <XStack jc="space-between" width="100%">
              <YStack ai="center" ml="$6">
                <Paragraph
                  size="$9"
                  color={
                    soloWorkouts > 4
                      ? "$accent"
                      : soloWorkouts > 0
                      ? "$warning"
                      : "$danger"
                  }>
                  {soloWorkouts}
                </Paragraph>
                <Paragraph fontSize="$2" color="$textSoft">
                  Solo
                </Paragraph>
              </YStack>
              <YStack ai="center" mr="$6">
                <Paragraph
                  size="$9"
                  color={
                    groupWorkouts > 4
                      ? "$accent"
                      : groupWorkouts > 0
                      ? "$warning"
                      : "$danger"
                  }>
                  {groupWorkouts}
                </Paragraph>
                <Paragraph fontSize="$2" color="$textSoft">
                  Group
                </Paragraph>
              </YStack>
            </XStack>
          </YStack>
        </XStack>
      </YStack>
      <BottomSheet
        snapPoints={[45]}
        handleDismiss={() => setShowSheet(false)}
        open={showSheet}>
        <YStack ai="center" gap="$5">
          <H4>Add workouts</H4>
          {isMutating ? (
            <XStack jc="center" mt="$5">
              <Spinner size="large" />
            </XStack>
          ) : (
            <>
              <YStack mb="$4">
                <XStack ai="center" jc="space-between">
                  <Paragraph fontSize="$6" pr="$4">
                    Workouts:
                  </Paragraph>
                  <Input
                    onChangeText={text => {
                      setError("");
                      setNewWorkouts(text);
                    }}
                    inputMode="numeric"
                    keyboardType="numeric"
                    placeholder="12"
                    value={String(newWorkouts)}
                    bg="$backgroundSoft"
                    placeholderTextColor="$textSofter"
                    borderColor="$backgroundSoftActive"
                    borderWidth="$0.5"
                  />
                </XStack>
                {error && (
                  <Paragraph color="$error" size="$2">
                    {error}
                  </Paragraph>
                )}
                <XStack ai="center" jc="space-between" mt="$4">
                  <Paragraph fontSize="$6" pr="$4">
                    Solo:
                  </Paragraph>
                  <ThumbSwitch value={solo} onValueChange={setSolo} />
                </XStack>
              </YStack>
              <SheetControls
                confirmDisabled={!!error}
                handleCancel={reset}
                handleConfirm={async () => await confirm()}
              />
            </>
          )}
        </YStack>
      </BottomSheet>
      {!showSheet && (
        <FloatingActionButton
          onPress={() => {
            setShowSheet(true);
          }}
        />
      )}
    </ScreenContainer>
  );
};
