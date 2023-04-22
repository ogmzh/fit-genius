import { Filter } from "@tamagui/lucide-icons";
import { Button, Paragraph, Stack, YStack } from "tamagui";

type Props = {
  onPress: () => void;
  activeFilters?: number;
  showFilterCount?: boolean;
};

export const FilterButton = ({
  onPress,
  activeFilters = 0,
  showFilterCount = false,
}: Props) => {
  return (
    <YStack>
      <Button
        position="relative"
        iconAfter={<Filter color="white" />}
        onPress={() => onPress()}
        bg="$secondary"
        pressStyle={{
          backgroundColor: "$secondarySoft",
        }}
      />
      {showFilterCount && (
        <Stack
          position="absolute"
          right={-4}
          top={-7}
          boc="$primary"
          br="$6"
          bg="$primary"
          px="$2">
          <Paragraph scale={0.9} color="white">
            {activeFilters}
          </Paragraph>
        </Stack>
      )}
    </YStack>
  );
};
