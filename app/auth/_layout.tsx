import { Stack } from "expo-router"

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Title'ı gizle
      }}
    >
      <Stack.Screen options={{ headerShown: false }} name="privacy" />
    </Stack>
  )
}
