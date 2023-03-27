import { ReactNode } from "react";
import { AlertDialog, Button, XStack, YStack } from "tamagui";

type Props = {
  title: string;
  children: ReactNode;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  hideConfirm?: boolean;
  hideCancel?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export const ConfirmDialog = ({
  title,
  children,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  hideConfirm,
  hideCancel,
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <AlertDialog>
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          o={0.5}
          enterStyle={{ o: 0 }}
          exitStyle={{ o: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}>
          <YStack space>
            <AlertDialog.Title size="$6">{title}</AlertDialog.Title>
            <AlertDialog.Description size="$4">
              {description}
            </AlertDialog.Description>

            <XStack space="$3" jc="flex-end">
              {!hideCancel && (
                <AlertDialog.Cancel asChild>
                  <Button
                    color="$textSoft"
                    onPress={onCancel && (() => onCancel())}>
                    {cancelText}
                  </Button>
                </AlertDialog.Cancel>
              )}
              {!hideConfirm && (
                <AlertDialog.Action asChild>
                  <Button
                    bg="$primary"
                    color="$text"
                    onPress={onConfirm && (() => onConfirm())}>
                    {confirmText}
                  </Button>
                </AlertDialog.Action>
              )}
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};
