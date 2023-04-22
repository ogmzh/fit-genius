import { ReactNode } from "react";
import { Adapt, Popover, PopoverProps } from "tamagui";

interface Props extends PopoverProps {
  trigger: ReactNode;
}

export const Popout = ({ trigger, children, ...props }: Props) => {
  return (
    <Popover {...props}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Sheet>
        <Popover.Sheet.Frame padding="$2" bg="red">
          <Adapt.Contents />
        </Popover.Sheet.Frame>
        <Popover.Sheet.Overlay />
      </Popover.Sheet>
      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        bg="$background"
        enterStyle={{ x: 0, y: -10, opacity: 0 }}
        exitStyle={{ x: 0, y: -10, opacity: 0 }}
        x={-70}
        y={20}
        opacity={1}
        animation={[
          "quick",
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        elevate>
        {children}
      </Popover.Content>
    </Popover>
  );
};
