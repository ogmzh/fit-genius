import { H4, Input, Paragraph, XStack, YStack } from "tamagui";
import ScreenContainer from "../components/screen-container";
import { FloatingActionButton } from "../components/floating-action-button";
import { useState } from "react";
import { BottomSheet } from "../components/sheet/bottom-sheet";
import { SheetControls } from "../components/sheet/sheet-controls";

export const Payments = () => {
  const [showSheet, setShowSheet] = useState(false);
  return (
    <ScreenContainer>
      <YStack ai="center">
        <XStack
          mt="$2"
          w="70%"
          bg="$backgroundSoft"
          jc="space-between"
          ai="center"
          px="$6"
          py="$4"
          bw="$0.5"
          br="$3"
          boc="$backgroundSoftActive">
          <XStack>
            <Paragraph>Workouts remaining:</Paragraph>
          </XStack>
          <Paragraph size="$9" color="$accent">
            12
          </Paragraph>
        </XStack>
      </YStack>
      <BottomSheet
        handleDismiss={() => setShowSheet(false)}
        open={showSheet}>
        <YStack ai="center" gap="$5">
          <H4>Add workouts</H4>
          <Input
            keyboardType="numeric"
            defaultValue="12"
            bg="$backgroundSoft"
            placeholderTextColor="$textSofter"
            borderColor="$backgroundSoftActive"
            borderWidth="$0.5"
          />
          <SheetControls
            handleCancel={() => setShowSheet(false)}
            handleConfirm={() => console.log("CONFIRM")}
          />
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
