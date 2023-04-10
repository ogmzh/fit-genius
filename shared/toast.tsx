import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { ThemeParsed } from "tamagui";
import { BaseToast, BaseToastProps } from "react-native-toast-message";

export type StyledToastProps = BaseToastProps & {
  style: StyleProp<ViewStyle>;
  text1Style: StyleProp<TextStyle>;
  text2Style: StyleProp<TextStyle>;
  contentContainerStyle: StyleProp<ViewStyle>;
};

export const toastWarningStyleProps = (
  theme: ThemeParsed
): StyledToastProps => ({
  contentContainerStyle: {
    backgroundColor: theme.backgroundSoft.val,
    paddingVertical: 20,
    zIndex: 999_999,
  },
  style: {
    borderLeftColor: theme.warning.val,
    zIndex: 999_999,
  },
  text1Style: {
    color: theme.text.val,
    fontWeight: "bold",
    fontSize: 15,
  },
  text2Style: {
    color: theme.text.val,
    fontSize: 13,
  },
});

export const toastConfig = {
  // new toast type, invoke it with Toast.show({ type: 'styled' })
  styled: (props: { props: StyledToastProps }) => {
    return (
      <BaseToast
        {...props}
        style={props.props.style} // pass styles through custom props
        contentContainerStyle={props.props.contentContainerStyle}
        text1Style={props.props.text1Style}
        text2Style={props.props.text2Style}
      />
    );
  },
};
