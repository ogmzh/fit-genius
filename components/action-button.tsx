import { Button } from "tamagui";

type Props = {
  disabled?: boolean;
  backgroundColor?: string;
  textColor?: string;
  pressStyleBackground?: string;
  onPress?: () => void;
  label?: string;
};

export const ActionButton = ({
  disabled,
  backgroundColor,
  textColor,
  pressStyleBackground,
  onPress,
  label,
}: Props) => {
  return (
    <Button
      w="$10"
      disabled={disabled}
      bg={backgroundColor}
      color={textColor}
      pressStyle={{ bg: pressStyleBackground }}
      onPress={onPress}>
      {label}
    </Button>
  );
};
