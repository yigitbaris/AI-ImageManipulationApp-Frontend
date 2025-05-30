import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { FontAwesome5 } from "@expo/vector-icons"
import { useState } from "react"

const { width } = Dimensions.get("window")
const cardWidth = (width - 45) / 2 // 45 = 15 padding on each side + 15 gap

interface DiscoverItem {
  id: number
  image: string | any // Support both URLs and require() results
  height: number
  premium: boolean
  likes?: number
  aiType: string
  title: string
}

const discoverItems: DiscoverItem[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face",
    height: 180,
    premium: false,
    likes: 234,
    aiType: "Portrait AI",
    title: "Professional Headshot",
  },
  {
    id: 2,
    image: require("../../assets/images/ghibli.png"),
    height: 220,
    premium: true,
    likes: 156,
    aiType: "Ghibli Style",
    title: "Studio Ghibli Art",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop",
    height: 160,
    premium: false,
    likes: 89,
    aiType: "Oil Painting",
    title: "Classic Art Style",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1604514628550-37477afdf4e3?w=400&h=600&fit=crop",
    height: 200,
    premium: true,
    likes: 412,
    aiType: "Background Removal",
    title: "Clean Background",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1600428877878-1a0fd85beda8?w=400&h=500&fit=crop",
    height: 170,
    premium: false,
    likes: 78,
    aiType: "Vintage Filter",
    title: "Retro Style",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=700&fit=crop&crop=face",
    height: 240,
    premium: true,
    likes: 523,
    aiType: "Portrait Lighting",
    title: "Studio Quality",
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face",
    height: 190,
    premium: false,
    likes: 167,
    aiType: "Beauty Enhancement",
    title: "Natural Glow",
  },
  {
    id: 8,
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop&crop=face",
    height: 210,
    premium: true,
    likes: 298,
    aiType: "Fashion AI",
    title: "Style Transfer",
  },
  {
    id: 9,
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop&crop=face",
    height: 150,
    premium: false,
    likes: 134,
    aiType: "Cartoon Style",
    title: "Fun Character",
  },
  {
    id: 10,
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=650&fit=crop&crop=face",
    height: 230,
    premium: true,
    likes: 445,
    aiType: "Glamour AI",
    title: "Magazine Look",
  },
  {
    id: 11,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=550&fit=crop&crop=face",
    height: 175,
    premium: false,
    likes: 89,
    aiType: "Pencil Sketch",
    title: "Hand Drawn",
  },
  {
    id: 12,
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=face",
    height: 195,
    premium: true,
    likes: 312,
    aiType: "Watercolor",
    title: "Artistic Paint",
  },
  {
    id: 13,
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=550&fit=crop&crop=face",
    height: 165,
    premium: false,
    likes: 156,
    aiType: "HDR Enhancement",
    title: "Sharp & Vivid",
  },
  {
    id: 14,
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&crop=face",
    height: 205,
    premium: true,
    likes: 278,
    aiType: "Cinematic",
    title: "Movie Style",
  },
]

const Discover = () => {
  const [activeTab, setActiveTab] = useState<"Feed" | "Creators">("Feed")

  // Split items into two columns
  const leftColumn: DiscoverItem[] = []
  const rightColumn: DiscoverItem[] = []

  discoverItems.forEach((item, index) => {
    if (index % 2 === 0) {
      leftColumn.push(item)
    } else {
      rightColumn.push(item)
    }
  })

  const renderCard = (item: DiscoverItem) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.card, { height: item.height }]}
    >
      <Image
        source={
          typeof item.image === "string" ? { uri: item.image } : item.image
        }
        style={styles.cardImage}
      />
      <View style={styles.cardOverlay}>
        <View style={styles.cardTopRow}>
          {item.premium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>PRO</Text>
            </View>
          )}
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.likesContainer}>
            <FontAwesome5 name="heart" size={12} color="#673ab7" solid />
            <Text style={styles.likesText}>{item.likes}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <TouchableOpacity style={styles.searchButton}>
          <FontAwesome5 name="search" size={20} color="#673ab7" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Feed" && styles.activeTab]}
          onPress={() => setActiveTab("Feed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Feed" && styles.activeTabText,
            ]}
          >
            Feed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Creators" && styles.activeTab]}
          onPress={() => setActiveTab("Creators")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Creators" && styles.activeTabText,
            ]}
          >
            Creators
          </Text>
        </TouchableOpacity>
      </View>

      {/* Grid Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.grid}>
          <View style={styles.column}>{leftColumn.map(renderCard)}</View>
          <View style={styles.column}>{rightColumn.map(renderCard)}</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Discover

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  searchButton: {
    padding: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    gap: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#673ab7",
  },
  activeTab: {
    backgroundColor: "#673ab7",
    borderColor: "#673ab7",
  },
  tabText: {
    fontSize: 16,
    color: "#673ab7",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  grid: {
    flexDirection: "row",
    gap: 8,
  },
  column: {
    flex: 1,
    gap: 8,
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
    padding: 8,
  },
  premiumBadge: {
    alignSelf: "flex-end",
    backgroundColor: "#673ab7",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  premiumText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#fff",
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  cardFooter: {
    alignSelf: "flex-end",
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  likesText: {
    fontSize: 11,
    color: "#673ab7",
    fontWeight: "600",
  },
})
