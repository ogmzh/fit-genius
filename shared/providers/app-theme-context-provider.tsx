import { ReactNode, createContext, useContext, useState } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";

type AppThemeContextValue = {
  theme: ColorSchemeName;
  setTheme: (theme: NonNullable<ColorSchemeName>) => void;
};

export const AppThemeContext = createContext<AppThemeContextValue>({
  theme: "light",
  setTheme: () => {},
});

export const AppThemeContextProvider = ({
  children,
}: {
  children?: ReactNode;
}) => {
  const deviceTheme = useColorScheme();
  const [theme, setTheme] = useState<NonNullable<ColorSchemeName>>(
    deviceTheme ?? "light"
  );

  return (
    <AppThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </AppThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  return useContext(AppThemeContext);
};
