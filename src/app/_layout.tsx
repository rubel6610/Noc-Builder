import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { TemplateProvider } from "../context/TemplateContext";
import { NocProvider } from "../context/NocContext";
import { AppThemeProvider, useAppTheme } from "../context/ThemeContext";
import "../../global.css";

function AppLayoutContent() {
  const { theme } = useAppTheme();

  return (
    <PaperProvider theme={theme}>
      <TemplateProvider>
        <NocProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </NocProvider>
      </TemplateProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <AppLayoutContent />
    </AppThemeProvider>
  );
}
