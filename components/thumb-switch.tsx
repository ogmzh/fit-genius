import { Switch } from "tamagui";

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export const ThumbSwitch = ({ value, onValueChange }: Props) => {
  return (
    <Switch
      size="$4"
      bg={value ? "$primary" : "$backgroundSoft"}
      onCheckedChange={onValueChange}
      checked={value}>
      <Switch.Thumb animation="quick" />
    </Switch>
  );
};
