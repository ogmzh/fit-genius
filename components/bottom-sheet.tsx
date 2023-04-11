import { Sheet } from "tamagui";

type Props = {
  open: boolean;
  snapPoints: number[];
  position: number;
  handleDismiss: () => void;
  children: React.ReactNode;
  hideDragHandle?: boolean;
};

export const BottomSheet = ({
  open,
  snapPoints,
  position,
  handleDismiss,
  children,
  hideDragHandle,
}: Props) => {
  return (
    <Sheet
      open={open}
      snapPoints={snapPoints}
      position={position}
      dismissOnSnapToBottom
      dismissOnOverlayPress
      onOpenChange={handleDismiss}>
      <Sheet.Overlay bg="$backgroundSoft" />
      {!hideDragHandle && <Sheet.Handle bg="$primary" />}
      <Sheet.Frame f={1} p="$4" space="$5" borderTopColor="red">
        {children}
      </Sheet.Frame>
    </Sheet>
  );
};
