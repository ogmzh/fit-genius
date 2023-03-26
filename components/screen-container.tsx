import { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "tamagui";

const TSafeAreaView = styled(SafeAreaView);

export default function ScreenContainer({
  children,
}: {
  children?: ReactNode;
}) {
  return (
    <TSafeAreaView flex={1} bg="$background">
      {children}
    </TSafeAreaView>
  );
}
