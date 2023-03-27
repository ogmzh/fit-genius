import { ReactNode } from "react";
import { Paragraph, XStack, YStack } from "tamagui";

type Props = {
  firstName: string;
  lastName: string;
  children?: ReactNode;
  email?: string;
  onPress?: () => void;
  isSelected?: boolean;
};

export const ClientCard = ({
  firstName,
  lastName,
  email,
  onPress,
  children,
  isSelected,
}: Props) => {
  return (
    <XStack
      boc={isSelected ? "$accent" : "$backgroundSoft"}
      onPress={onPress}
      jc="space-between"
      ai="center"
      bg="$backgroundSoft"
      px="$4"
      py="$3"
      mb="$4"
      br="$2"
      mx="$6"
      bw="$1"
      pressStyle={{
        bg: "$backgroundSoftActive",
      }}>
      <YStack>
        <Paragraph col="$text" fontWeight="bold" size="$6">
          {firstName} {lastName}
        </Paragraph>
        <Paragraph col="$textSoft">{email}</Paragraph>
      </YStack>
      {/* controls */}
      {children}
    </XStack>
  );
};
