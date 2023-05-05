import { AnimatePresence, Paragraph, Square, XStack } from "tamagui";

import { Check } from "@tamagui/lucide-icons";

type Props = {
  checked: boolean;
  onPress: () => void;
  label: string;
};

export const FilterChip = ({ checked, onPress, label }: Props) => {
  return (
    <XStack
      key="check"
      onPress={() => onPress()}
      px="$3"
      boc="$backgroundSoftActive"
      br="$6"
      ai="center"
      gap="$1"
      py="$2"
      bg="$backgroundSoftActive">
      <AnimatePresence>
        {checked && (
          <Square
            key="check"
            animation="smooth"
            enterStyle={{
              opacity: 0,
            }}
            exitStyle={{
              opacity: 0,
            }}
            x={0}
            scale={1}
            opacity={1}>
            <Check color="$primary" size="$1" />
          </Square>
        )}
      </AnimatePresence>
      <Paragraph
        id="label"
        pl="$1"
        size="$2"
        color={checked ? "$text" : "$textSoft"}>
        {label}
      </Paragraph>
    </XStack>
  );
};
