import { AlertDialog, Spinner } from "tamagui";

export const BackdropSpinner = ({ visible }: { visible: boolean }) => {
  return (
    <AlertDialog open={visible}>
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
          bw={0}
          backgroundColor="$backgroundTransparent"
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
          <Spinner size="large" />
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};
