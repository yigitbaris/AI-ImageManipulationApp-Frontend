import React from "react"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import Entypo from "@expo/vector-icons/Entypo"
import { Link, Tabs } from "expo-router"
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons"
import { Platform } from "react-native"
import { useGlobalContext } from "@/context/GlobalProvider"
import { translations } from "@/assets/localizations"

// Updated color palette to match gradient-bg.png
const COLORS = {
  gradientStart: "#7F1DFF", // Purple
  gradientEnd: "#FF4FCC", // Pink
  tabBarBackground: "rgba(13, 13, 13, 0.9)", // More transparent glass effect (changed from 0.8 to 0.4)
  tabBarBorder: "rgba(255, 255, 255, 0.1)", // Subtle white border
  tabIconInactive: "rgba(255, 255, 255, 0.5)", // Dimmed white for inactive
  tabIconActive: "#FF4FCC", // Pink for active state
}

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"]
  color: string
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
}

export default function TabLayout() {
  const { myLang } = useGlobalContext()

  // Safe way to access translations
  const getTranslations = () => {
    const validLangs = ["tr", "german", "russian", "eng"] as const
    const currentLang = validLangs.includes(myLang as any) ? myLang : "eng"
    return (translations as any)[currentLang] || (translations as any).eng
  }

  const t = getTranslations()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.tabIconActive,
        tabBarInactiveTintColor: COLORS.tabIconInactive,
        headerShown: true,
        tabBarStyle: {
          paddingTop: 5,
          paddingBottom: Platform.OS === "ios" ? 25 : 5,
          height: Platform.OS === "ios" ? 85 : 80,
          backgroundColor: COLORS.tabBarBackground,
          borderTopWidth: 0,
          borderTopColor: COLORS.tabBarBorder,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          shadowColor: COLORS.gradientStart,
          shadowOffset: {
            width: 0,
            height: -1,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-medium",
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="generate"
        options={{
          title: t.generateTab,
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome6
              name="wand-magic-sparkles"
              size={20}
              color={color}
              style={{ marginBottom: -2 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: t.discoverTab,
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome5
              name="compass"
              size={20}
              color={color}
              style={{ marginBottom: -2 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: t.profileTab,
          tabBarIcon: ({ color }) => (
            <FontAwesome5
              name="user-circle"
              size={20}
              color={color}
              style={{ marginBottom: -2 }}
            />
          ),
        }}
      />
    </Tabs>
  )
}
