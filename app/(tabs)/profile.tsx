import {
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native"
import { Text, View } from "@/components/Themed"
import { SafeAreaView } from "react-native-safe-area-context"
import { FontAwesome5 } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useState } from "react"

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
}

export default function Profile() {
  const [user] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format",
    isPremium: false,
    joinDate: "March 2024",
  })

  const stats: ProfileStat[] = [
    { id: 1, label: "Created", value: "24", icon: "magic" },
    { id: 2, label: "Saved", value: "12", icon: "heart" },
    { id: 3, label: "Shared", value: "8", icon: "share-alt" },
  ]

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => {} },
      ],
      { cancelable: true }
    )
  }

  const settingsItems: SettingItem[] = [
    {
      id: 1,
      title: "Edit Profile",
      icon: "user-edit",
      action: () => {},
      hasArrow: true,
    },
    {
      id: 2,
      title: "Privacy Settings",
      icon: "shield-alt",
      action: () => {},
      hasArrow: true,
    },
    {
      id: 3,
      title: "Notifications",
      icon: "bell",
      action: () => {},
      hasArrow: true,
    },
    {
      id: 4,
      title: "Help & Support",
      icon: "question-circle",
      action: () => {},
      hasArrow: true,
    },
    {
      id: 5,
      title: "About",
      icon: "info-circle",
      action: () => {},
      hasArrow: true,
    },
    {
      id: 6,
      title: "Logout",
      icon: "sign-out-alt",
      action: handleLogout,
      hasArrow: false,
      textColor: "#e74c3c",
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarIcon}>
                <FontAwesome5 name="user" size={35} color="#673ab7" />
              </View>
              {user.isPremium && (
                <View style={styles.premiumBadge}>
                  <FontAwesome5 name="crown" size={12} color="#FFD700" />
                </View>
              )}
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          {stats.map((stat) => (
            <View key={stat.id} style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <FontAwesome5 name={stat.icon} size={18} color="#673ab7" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Premium Card */}
        {!user.isPremium && (
          <TouchableOpacity style={styles.premiumCard}>
            <LinearGradient
              colors={["#673ab7", "#9c27b0", "#e91e63"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.premiumGradient}
            >
              <View style={styles.premiumContent}>
                <View style={styles.premiumLeft}>
                  <FontAwesome5 name="crown" size={24} color="#FFD700" />
                  <View style={styles.premiumTextContainer}>
                    <Text style={styles.premiumTitle}>Go Premium</Text>
                    <Text style={styles.premiumSubtitle}>
                      Unlock unlimited AI filters and features
                    </Text>
                  </View>
                </View>
                <FontAwesome5 name="arrow-right" size={18} color="#fff" />
              </View>
              <View style={styles.premiumFeatures}>
                <View style={styles.premiumFeature}>
                  <FontAwesome5 name="check" size={12} color="#4CAF50" />
                  <Text style={styles.premiumFeatureText}>
                    Unlimited generations
                  </Text>
                </View>
                <View style={styles.premiumFeature}>
                  <FontAwesome5 name="check" size={12} color="#4CAF50" />
                  <Text style={styles.premiumFeatureText}>
                    Exclusive AI filters
                  </Text>
                </View>
                <View style={styles.premiumFeature}>
                  <FontAwesome5 name="check" size={12} color="#4CAF50" />
                  <Text style={styles.premiumFeatureText}>
                    Priority processing
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsList}>
            {settingsItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.settingItem,
                  index === settingsItems.length - 1 && styles.lastSettingItem,
                ]}
                onPress={item.action}
              >
                <View style={styles.settingLeft}>
                  <View
                    style={[
                      styles.settingIconContainer,
                      item.textColor && {
                        backgroundColor: "rgba(231, 76, 60, 0.1)",
                      },
                    ]}
                  >
                    <FontAwesome5
                      name={item.icon}
                      size={16}
                      color={item.textColor || "#673ab7"}
                    />
                  </View>
                  <Text
                    style={[
                      styles.settingTitle,
                      item.textColor && { color: item.textColor },
                    ]}
                  >
                    {item.title}
                  </Text>
                </View>
                {item.hasArrow && (
                  <FontAwesome5 name="chevron-right" size={14} color="#ccc" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  userCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatarIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(103, 58, 183, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  premiumBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    borderRadius: 12,
    padding: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  joinDate: {
    fontSize: 12,
    color: "#888",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statIconContainer: {
    backgroundColor: "rgba(103, 58, 183, 0.1)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  premiumCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#673ab7",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  premiumGradient: {
    padding: 20,
  },
  premiumContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  premiumLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "transparent",
  },
  premiumTextContainer: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: "transparent",
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFE4E1",
    marginBottom: 2,
  },
  premiumSubtitle: {
    fontSize: 14,
    color: "#F0E6FF",
  },
  premiumFeatures: {
    gap: 8,
    backgroundColor: "transparent",
  },
  premiumFeature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "transparent",
  },
  premiumFeatureText: {
    fontSize: 13,
    color: "#E8D5FF",
    fontWeight: "500",
  },
  settingsSection: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  settingsList: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  lastSettingItem: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIconContainer: {
    backgroundColor: "rgba(103, 58, 183, 0.1)",
    borderRadius: 10,
    padding: 10,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
})
