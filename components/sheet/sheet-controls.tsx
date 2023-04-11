import { AnimatePresence, Button, XStack } from "tamagui";

import { Check, X } from "@tamagui/lucide-icons";

type Props = {
  handleConfirm: () => void;
  handleCancel: () => void;
};

export const SheetControls = ({ handleConfirm, handleCancel }: Props) => {
  return (
    <AnimatePresence>
      <XStack
        key="controls"
        gap="$4"
        jc="center"
        enterStyle={{
          scale: 1.2,
          opacity: 0,
        }}
        exitStyle={{
          scale: 1.2,
          opacity: 0,
        }}
        opacity={1}
        scale={1}
        y={0}
        elevation="$4"
        animation="quick">
        <Button
          circular
          onPress={handleConfirm}
          icon={Check}
          bg="$accent"
          pressStyle={{
            bg: "$accentActive",
          }}
          color="white"
          scaleIcon={1.8}
        />
        <Button
          circular
          icon={X}
          onPress={handleCancel}
          bg="$warning"
          pressStyle={{
            bg: "$error",
          }}
          color="white"
          scaleIcon={1.8}
        />
      </XStack>
    </AnimatePresence>
  );
};
