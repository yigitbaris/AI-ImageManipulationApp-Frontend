import {
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
} from "react-native"
import { Text, View } from "@/components/Themed"
import { SafeAreaView } from "react-native-safe-area-context"
import { FontAwesome5 } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useState } from "react"

// COLORS inspired by generate.tsx for consistency
const COLORS = {
  background: "#0D0D0D", // Darker background
  backgroundCard: "rgba(255, 255, 255, 0.08)", // More subtle glass effect
  gradientStart: "#7F1DFF",
  gradientEnd: "#FF4FCC",
  textPrimary: "#F5F5F5",
  textSecondary: "rgba(255, 255, 255, 0.6)",
  iconPurple: "#7F1DFF",
  iconWhite: "#FFFFFF",
  borderColor: "rgba(255, 255, 255, 0.1)",
  cardShadow: "rgba(0, 0, 0, 0.8)",
  logoutText: "#FF3B30",
  white: "#FFFFFF",
  black: "#000000",
  grey: "#8E8E93", // From generate.tsx
  premiumBannerText: "#FFFFFF",
}

interface ProfileStat {
  id: number
  label: string
  value: string
  icon: string
}

interface SettingItem {
  id: number
  title: string
  icon: string
  action: () => void
  hasArrow?: boolean
  textColor?: string
  iconColor?: string
}

// GlassPanel component similar to generate.tsx's GlassCard for consistency
const GlassPanel = ({
  children,
  style,
}: {
  children: React.ReactNode
  style?: any
}) => <View style={[styles.glassPanelBase, style]}>{children}</View>

export default function Profile() {
  const [user] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
  })

  const stats = [
    { id: 1, label: "Creations", value: "24", icon: "magic" },
    { id: 2, label: "Favorites", value: "12", icon: "heart" },
    { id: 3, label: "Shares", value: "8", icon: "share-alt" },
  ]

  const menuItems = [
    {
      id: 1,
      title: "Settings",
      icon: "cog",
      action: () => console.log("Settings"),
    },
    {
      id: 2,
      title: "Privacy",
      icon: "shield-alt",
      action: () => console.log("Privacy"),
    },
    // {
    //   id: 3,
    //   title: "Notifications",
    //   icon: "bell",
    //   action: () => console.log("Notifications"),
    // },
    {
      id: 4,
      title: "Help",
      icon: "question-circle",
      action: () => console.log("Help"),
    },
    {
      id: 5,
      title: "About",
      icon: "info-circle",
      action: () => console.log("About"),
    },
    {
      id: 6,
      title: "Logout",
      icon: "sign-out-alt",
      action: () => console.log("Logout"),
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {/* Profile Info */}
        <GlassPanel style={styles.userCard}>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </GlassPanel>

        {/* Stats Bar */}
        <GlassPanel style={styles.statsCard}>
          {stats.map((stat) => (
            <View key={stat.id} style={styles.statItem}>
              <FontAwesome5
                name={stat.icon as any}
                size={20}
                color={COLORS.gradientStart}
              />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </GlassPanel>

        {/* premium banner */}
        <TouchableOpacity activeOpacity={0.8}>
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.premiumBanner}
          >
            {/* Left: Crown icon */}
            <FontAwesome5 name="crown" size={20} color={COLORS.white} />

            {/* Center: Title + Subtitle */}
            <View style={styles.premiumTextContainer}>
              <Text style={styles.premiumTitle}>Go Premium</Text>
              <Text style={styles.premiumSubtitle}>
                Unlock exclusive features
              </Text>
            </View>

            {/* Right: Arrow icon */}
            <FontAwesome5 name="arrow-right" size={16} color={COLORS.white} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            onPress={item.action}
            style={styles.settingItemTouchable}
          >
            <GlassPanel style={styles.settingItemPanel}>
              <View style={styles.settingIconContainer}>
                <FontAwesome5
                  name={item.icon as any}
                  size={18}
                  color={COLORS.gradientStart}
                />
              </View>
              <Text style={styles.settingTitleText}>{item.title}</Text>
              <FontAwesome5
                name="chevron-right"
                size={14}
                color={COLORS.textSecondary}
              />
            </GlassPanel>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50,
  },
  profileHeaderOuterContainer: {
    marginBottom: 20,
  },
  glassPanelBase: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 16,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  userCard: {
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Slightly different from card for layering
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)", // White outline for avatar circle
    position: "relative", // For premium badge
  },
  premiumBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: COLORS.background, // So it looks cut into the avatar circle
  },
  userDetails: {
    alignItems: "center",
    backgroundColor: "transparent",
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
    textAlign: "center",
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  statsCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 24,
    backgroundColor: "rgba(20, 20, 20, 0.8)",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "transparent",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  settingsSectionContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-bold",
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 12, // Space between title and first setting item
    paddingLeft: 4, // Small indent to align with card content generally
  },
  settingItemTouchable: {
    marginBottom: 12,
  },
  settingItemPanel: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "rgba(20, 20, 20, 0.8)",
  },
  firstSettingItemPanel: {
    // Potentially different styling for the first item (e.g. if part of a larger card)
  },
  lastSettingItemPanel: {
    marginBottom: 0, // No margin for the last item in the list
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    backgroundColor: "rgba(127, 29, 255, 0.1)",
  },
  settingTitleText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    flex: 1,
  },
  premiumBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 24,

    // Drop‐shadow (similar to generateButton in generate.tsx)
    shadowColor: COLORS.gradientEnd,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },

  premiumTextContainer: {
    flex: 1,
    marginHorizontal: 12,
    alignItems: "flex-start",
    backgroundColor: "transparent",
  },

  premiumTitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-bold",
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.premiumBannerText,
    marginBottom: 2,
  },

  premiumSubtitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontSize: 13,
    color: COLORS.premiumBannerText,
    opacity: 0.85,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 12,
    backgroundColor: "transparent",
  },
  searchPlaceholder: {
    color: COLORS.white,
    fontSize: 16,
  },
})
