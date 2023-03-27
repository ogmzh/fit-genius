import { Plus } from "@tamagui/lucide-icons";
import { FunctionComponent } from "react";
import { Button } from "tamagui";

export const FloatingActionButton = ({
  onPress,
  icon = <Plus color="$icon" size="$2" />,
}: {
  onPress: () => void;
  icon?:
    | JSX.Element
    | FunctionComponent<{ color?: string; size?: number }>;
}) => (
  <Button
    pos="absolute"
    bottom="$8"
    right="$5"
    elevate
    w="$5"
    h="$5"
    bg="$accent"
    pressStyle={{ bg: "$accentActive" }}
    icon={icon}
    onPress={onPress}
  />
);
