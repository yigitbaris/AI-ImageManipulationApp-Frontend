import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { FontAwesome5 } from "@expo/vector-icons"
import { useState } from "react"
import { LinearGradient } from "expo-linear-gradient"

const { width } = Dimensions.get("window")
const cardPadding = 8 // Consistent padding/gap for grid items
const numColumns = 2
const cardWidth = (width - cardPadding * (numColumns + 1)) / numColumns

// Updated Color Palette (consistent with generate.tsx)
const COLORS = {
  background: "#101010", // Very dark gray
  backgroundCard: "rgba(255, 255, 255, 0.1)", // Glassmorphic card background (slightly less transparent than generate)
  gradientStart: "#7F1DFF", // Purple
  gradientEnd: "#FF4FCC", // Pink
  textPrimary: "#F5F5F5", // Off-white
  textSecondary: "#E0E0E0", // Slightly dimmer for less emphasis
  iconWhite: "#FFFFFF",
  secondaryHighlight: "#FF6FD8", // Light pink for search icon & likes background
  borderColor: "rgba(127, 29, 255, 0.3)", // Purple at 30% for faint borders
  proBadgeText: "#FFFFFF",
  white: "#FFFFFF",
  black: "#000000",
}

interface DiscoverItem {
  id: number
  image: string | any
  height: number // This will determine the staggered effect
  premium: boolean
  likes?: number
}

const discoverItems: DiscoverItem[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop&crop=face",
    height: cardWidth * 1.3, // Aspect ratio for cards
    premium: false,
    likes: 234,
  },
  {
    id: 2,
    image: require("../../assets/images/ghibli.png"),
    height: cardWidth * 1.6,
    premium: true,
    likes: 156,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&fit=crop",
    height: cardWidth * 1.2,
    premium: false,
    likes: 89,
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1604514628550-37477afdf4e3?w=400&fit=crop",
    height: cardWidth * 1.5,
    premium: true,
    likes: 412,
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1600428877878-1a0fd85beda8?w=400&fit=crop",
    height: cardWidth * 1.4,
    premium: false,
    likes: 78,
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&fit=crop&crop=face",
    height: cardWidth * 1.7,
    premium: true,
    likes: 523,
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&fit=crop&crop=face",
    height: cardWidth * 1.35,
    premium: false,
    likes: 167,
  },
  {
    id: 8,
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&fit=crop&crop=face",
    height: cardWidth * 1.55,
    premium: true,
    likes: 298,
  },
]

const GlassHeader = ({
  title,
  onSearchPress,
}: {
  title: string
  onSearchPress: () => void
}) => {
  // This component would ideally use BlurView for a true glass effect on scroll.
  // For now, it's a semi-transparent View.
  return (
    <View style={styles.headerGlassPanel}>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity
        onPress={onSearchPress}
        style={styles.searchIconContainer}
      >
        <FontAwesome5
          name="search"
          size={20}
          color={COLORS.secondaryHighlight}
        />
      </TouchableOpacity>
    </View>
  )
}

const Discover = () => {
  const [activeTab, setActiveTab] = useState<"Feed" | "Creators">("Feed")

  // Split items into two columns for masonry layout
  const распределитьПоКолонкам = (items: DiscoverItem[], numCols: number) => {
    const columns: DiscoverItem[][] = Array.from({ length: numCols }, () => [])
    const columnHeights: number[] = Array(numCols).fill(0)

    items.forEach((item) => {
      const shortestColumnIndex = columnHeights.indexOf(
        Math.min(...columnHeights)
      )
      columns[shortestColumnIndex].push(item)
      columnHeights[shortestColumnIndex] += item.height // Or a fixed value if height doesn't vary much
    })
    return columns
  }

  const columns = распределитьПоКолонкам(discoverItems, numColumns)
  const leftColumnItems = columns[0] || []
  const rightColumnItems = columns[1] || []

  const renderCard = (item: DiscoverItem, index: number) => (
    <TouchableOpacity
      key={`${item.id}-${index}`}
      style={[styles.card, { height: item.height, width: cardWidth }]} // Width is now fixed
    >
      {/* <BlurView intensity={10} tint="dark" style={StyleSheet.absoluteFill} /> Optional true blur */}
      <Image
        source={
          typeof item.image === "string" ? { uri: item.image } : item.image
        }
        style={styles.cardImage}
      />
      <View style={styles.cardInnerBorder} />

      {item.premium && (
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.proBadge}
        >
          <Text style={styles.proBadgeText}>PRO</Text>
        </LinearGradient>
      )}

      {item.likes !== undefined && (
        <View style={styles.likesContainer}>
          <FontAwesome5 name="heart" size={12} color={COLORS.iconWhite} solid />
          <Text style={styles.likesText}>{item.likes}</Text>
        </View>
      )}
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <GlassHeader
        title="Discover"
        onSearchPress={() => console.log("Search pressed")}
      />

      <View style={styles.tabsContainer}>
        {["Feed", "Creators"].map((tabName) => (
          <TouchableOpacity
            key={tabName}
            style={styles.tabButton}
            onPress={() => setActiveTab(tabName as "Feed" | "Creators")}
          >
            {activeTab === tabName && (
              <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.activeTabGradient}
              />
            )}
            <View
              style={[
                styles.tabContent,
                activeTab === tabName ? styles.activeTabContent : {},
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tabName ? styles.activeTabText : {},
                ]}
              >
                {tabName}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <View style={styles.gridContainer}>
          <View style={styles.column}>{leftColumnItems.map(renderCard)}</View>
          <View style={styles.column}>{rightColumnItems.map(renderCard)}</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Discover

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Sticky Header (Glass Panel)
  headerGlassPanel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "rgba(20, 20, 20, 0.7)", // Darker glass for header
    // For actual blur, use <BlurView> as parent or background
    // borderBottomWidth: 1, // Optional: if you want a separator
    // borderBottomColor: "rgba(255, 255, 255, 0.1)",
    // Position sticky is handled by placing it outside ScrollView
    // For a more advanced sticky header with scroll effects, a library might be needed.
    zIndex: 10, // Ensure header is on top
  },
  headerTitle: {
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "sans-serif-bold", // Example font
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  searchIconContainer: {
    padding: 8, // Make touch target larger
  },

  // Tabs (Segmented Control)
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(30, 30, 30, 0.5)", // Glassy background for tab bar area
    borderRadius: 12, // Rounded container for tabs
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    // Use BlurView here for better effect if available
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  tabButton: {
    flex: 1, // Each tab takes equal space
    borderRadius: 10, // Rounded corners for the touchable area of the tab
    overflow: "hidden", // Ensures gradient is contained
    marginHorizontal: 5, // Space between tabs
  },
  activeTabGradient: {
    ...StyleSheet.absoluteFillObject, // Fill the button
    borderRadius: 10,
  },
  tabContent: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent", // Default, gradient will show through if active
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)", // Slight border for inactive tabs
  },
  activeTabContent: {
    borderColor: "transparent", // No border for active tab as gradient provides outline
  },
  tabText: {
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "sans-serif-medium",
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.iconWhite,
    fontWeight: "bold",
  },

  // Grid & Columns
  scrollContentContainer: {
    paddingHorizontal: cardPadding, // Gutter on the sides of the grid
    paddingTop: 10, // Space below tabs
    paddingBottom: 30, // Space at the bottom
  },
  gridContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // This will use the cardPadding for space
  },
  column: {
    flex: 1,
    // Removed gap here, spacing is handled by card margins or grid padding
  },

  // Image Cards (Glassmorphic)
  card: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 16, // Softly rounded corners (12-16px)
    overflow: "hidden", // Important for rounded corners on Image
    marginBottom: cardPadding, // Vertical gap between cards in a column
    // For backdrop-blur, use BlurView within this card
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3, // Soft shadows
    shadowRadius: 8,
    elevation: 6, // Android shadow
    position: "relative", // For absolute positioning of badges/likes
  },
  cardInnerBorder: {
    // Faint inner glow or border in purple
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderColor, // Purple #7F1DFF at low opacity
    opacity: 0.5, // Make it more subtle
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  // PRO Badge
  proBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8, // Pill-shaped
    alignItems: "center",
    justifyContent: "center",
  },
  proBadgeText: {
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "sans-serif-bold",
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.proBadgeText, // White text
  },

  // Likes Indicator
  likesContainer: {
    position: "absolute",
    bottom: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 111, 216, 0.5)", // Light pink (#FF6FD8) at ~50% opacity
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20, // Pill-shaped
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  likesText: {
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "sans-serif-medium",
    fontSize: 12,
    color: COLORS.iconWhite, // White icon/text
    marginLeft: 5,
    fontWeight: "600",
  },
})
