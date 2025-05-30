import React from "react"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import Entypo from "@expo/vector-icons/Entypo"
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons"

import { Link, Tabs } from "expo-router"

import Colors from "@/constants/Colors"
import { useColorScheme } from "@/components/useColorScheme"
import { red } from "react-native-reanimated/lib/typescript/Colors"

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"]
  color: string
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
}

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#673ab7",
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: true,
        tabBarStyle: {
          paddingTop: 5,
          paddingBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="generate"
        options={{
          title: "Generate",

          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="wand-magic-sparkles" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          headerShown: false,

          headerTitleAlign: "center",
          headerShadowVisible: false,
          // HEADER KUTUSUNUN YÜKSEKLİĞİNİ AYARLA
          headerStyle: {
            backgroundColor: "white",
            height: 50, // istediğin yükseklik
          },
          // BAŞLIĞIN GÖRÜNDÜĞÜ ALANIN STİLİ
          headerTitleStyle: {
            fontWeight: "bold",
            color: Colors[colorScheme].text,
            fontSize: 20,
            // Genişliği sınırla, uzun yazıları kısaltsın
            maxWidth: 200,
          },
          // Başlık konteynerine ekstra padding vs. ayarlamak istersen
          headerTitleContainerStyle: {
            paddingHorizontal: 10,
          },
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="compass" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-circle" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
