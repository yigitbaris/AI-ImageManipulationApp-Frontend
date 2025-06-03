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
import { useRouter } from "expo-router"
import { useGlobalContext } from "../../context/GlobalProvider"
import { translations } from "../../assets/localizations"

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
  filterId: number // Maps to filter ID in generate.tsx
  filterName: string
  image: string | any
  height: number // This will determine the staggered effect
  premium: boolean
  likes?: number
}

const discoverItems: DiscoverItem[] = [
  {
    id: 1,
    filterId: 1, // Maps to Ghibli filter
    filterName: "Ghibli",
    image: require("../../assets/images/ghibli.png"),
    height: cardWidth * 1.6,
    premium: true,
    likes: 523,
  },
  {
    id: 2,
    filterId: 2, // Maps to Superhero filter
    filterName: "Superhero",
    image: require("../../assets/images/superhero.png"),
    height: cardWidth * 1.3,
    premium: false,
    likes: 234,
  },
  {
    id: 3,
    filterId: 3, // Maps to Disney Princes filter
    filterName: "Disney Princes",
    image: require("../../assets/images/disneyprinces.png"),
    height: cardWidth * 1.5,
    premium: true,
    likes: 412,
  },
  {
    id: 4,
    filterId: 4, // Maps to Van Gogh filter
    filterName: "Van Gogh",
    image: require("../../assets/images/vangogh.png"),
    height: cardWidth * 1.2,
    premium: false,
    likes: 167,
  },
  {
    id: 5,
    filterId: 5, // Maps to Armored Knight filter
    filterName: "Armored Knight",
    image: require("../../assets/images/armoredman.png"),
    height: cardWidth * 1.4,
    premium: false,
    likes: 156,
  },
  {
    id: 6,
    filterId: 6, // Maps to 80s Anime filter
    filterName: "80s Anime",
    image: require("../../assets/images/80sanime.png"),
    height: cardWidth * 1.7,
    premium: true,
    likes: 298,
  },
  {
    id: 7,
    filterId: 7, // Maps to Mermaid Fantasy filter
    filterName: "Mermaid Fantasy",
    image: require("../../assets/images/mermaid.png"),
    height: cardWidth * 1.35,
    premium: false,
    likes: 89,
  },
  {
    id: 8,
    filterId: 4, // Another Pencil Sketch variation
    filterName: "Portrait Sketch",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&fit=crop&crop=face",
    height: cardWidth * 1.55,
    premium: true,
    likes: 78,
  },
  {
    id: 9,
    filterId: 2, // Maps to Starter Pack filter (old)
    filterName: "Starter Pack",
    image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format",
    height: cardWidth * 1.3,
    premium: false,
    likes: 189,
  },
  {
    id: 10,
    filterId: 3, // Maps to Oil Painting filter (old)
    filterName: "Oil Painting",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&fit=crop",
    height: cardWidth * 1.5,
    premium: true,
    likes: 321,
  },
  {
    id: 11,
    filterId: 4, // Maps to Pencil Sketch filter (old)
    filterName: "Pencil Sketch",
    image:
      "https://images.unsplash.com/photo-1599074902614-a3fb3927b6a5?w=400&fit=crop",
    height: cardWidth * 1.2,
    premium: false,
    likes: 145,
  },
  {
    id: 12,
    filterId: 1, // Another Ghibli variation (old)
    filterName: "Ghibli Style",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop&crop=face",
    height: cardWidth * 1.4,
    premium: false,
    likes: 267,
  },
  {
    id: 13,
    filterId: 2, // Another Starter Pack variation (old)
    filterName: "Anime Style",
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&fit=crop&crop=face",
    height: cardWidth * 1.7,
    premium: true,
    likes: 412,
  },
  {
    id: 14,
    filterId: 3, // Another Oil Painting variation (old)
    filterName: "Classic Art",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&fit=crop&crop=face",
    height: cardWidth * 1.35,
    premium: false,
    likes: 198,
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
  const [activeTab, setActiveTab] = useState<"feed">("feed")
  const { myLang } = useGlobalContext()

  // Translation helper function
  const getTranslations = () => {
    const validLangs = ["tr", "german", "russian", "eng"] as const
    const currentLang = validLangs.includes(myLang as any) ? myLang : "eng"
    return (translations as any)[currentLang] || (translations as any).eng
  }

  const t = getTranslations()

  // Inside Discover component
  const router = useRouter()

  const handleFilterSelect = (item: DiscoverItem) => {
    router.push({
      pathname: "/(tabs)/generate",
      params: { filter: item.filterId.toString() }, // Use filterId to match generate.tsx filters
    })
  }

  // Split items into two columns for masonry layout
  const splitItemsIntoColumns = (items: DiscoverItem[], numCols: number) => {
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

  const columns = splitItemsIntoColumns(discoverItems, numColumns)
  const leftColumnItems = columns[0] || []
  const rightColumnItems = columns[1] || []

  const renderCard = (item: DiscoverItem, index: number) => (
    <TouchableOpacity
      onPress={() => handleFilterSelect(item)}
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

      {/* Filter Name Overlay */}
      {/* <View style={styles.filterNameOverlay}>
        <Text style={styles.filterNameText}>{item.filterName}</Text>
      </View> */}

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
        title={t.discoverTab}
        onSearchPress={() => console.log("Search pressed")}
      />

      <View style={styles.tabsContainer}>
        {["feed"].map((tabKey) => (
          <TouchableOpacity
            key={tabKey}
            style={styles.tabButton}
            onPress={() => setActiveTab(tabKey as "feed")}
          >
            {activeTab === tabKey && (
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
                activeTab === tabKey ? styles.activeTabContent : {},
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tabKey ? styles.activeTabText : {},
                ]}
              >
                {(t as any)[tabKey]}
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
    paddingBottom: 200, // Space at the bottom
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

  // Filter Name Overlay
  filterNameOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 16,
  },
  filterNameText: {
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "sans-serif-bold",
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.white,
  },
})
