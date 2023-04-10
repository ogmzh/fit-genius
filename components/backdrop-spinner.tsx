import { AlertDialog, Spinner } from "tamagui";

export const BackdropSpinner = ({ visible }: { visible: boolean }) => {
  return (
    <AlertDialog open={visible}>
      <AlertDialog.Portal zIndex={999}>
        <AlertDialog.Overlay
          key="overlay"
          zIndex={999}
          animation="quick"
          o={0.5}
          enterStyle={{ o: 0 }}
          exitStyle={{ o: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          zIndex={999}
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
          <Spinner size="large" zIndex={999} />
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};
