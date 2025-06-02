import React from "react"
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { Text } from "./Themed"

// Updated Color Palette (matching generate.tsx)
const COLORS = {
  gradientStart: "#7F1DFF", // Purple
  gradientEnd: "#FF4FCC", // Pink
  textPrimary: "#F5F5F5", // Off-white for headings
  iconWhite: "#FFFFFF",
  black: "#000000",
}

interface Filter {
  id: number
  name: string
  description: string
  icon: string
  mockup: string | any
}

interface FilterSelectorProps {
  filters: Filter[]
  selectedFilter: Filter | null
  onFilterSelect: (filter: Filter) => void
}

const FilterSelector: React.FC<FilterSelectorProps> = ({
  filters,
  selectedFilter,
  onFilterSelect,
}) => {
  return (
    <View style={styles.filtersSection}>
      <Text style={styles.filtersTitle}>Select AI Filter</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersScrollContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterCardBase,
              selectedFilter?.id === filter.id && styles.selectedFilterCard,
            ]}
            onPress={() => onFilterSelect(filter)}
          >
            <Image
              source={
                typeof filter.mockup === "string"
                  ? { uri: filter.mockup }
                  : filter.mockup
              }
              style={styles.filterMockupImage}
            />
            {selectedFilter?.id === filter.id && (
              <>
                {/* Left border with fade to center */}
                <LinearGradient
                  colors={[
                    COLORS.gradientStart,
                    "rgba(255, 79, 204, 0.3)",
                    "transparent",
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.selectedFilterBorderLeft}
                />
                {/* Right border with fade to center */}
                <LinearGradient
                  colors={[
                    "transparent",
                    "rgba(255, 79, 204, 0.3)",
                    COLORS.gradientStart,
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.selectedFilterBorderRight}
                />
              </>
            )}
            <View style={styles.filterIconOverlay}>
              <FontAwesome5
                name={filter.icon as any}
                size={18}
                color={
                  selectedFilter?.id === filter.id
                    ? COLORS.gradientStart
                    : COLORS.iconWhite
                }
              />
            </View>
            <View style={styles.filterNameContainer}>
              <Text style={styles.filterNameText}>{filter.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  // Filters Section Styles
  filtersSection: {
    width: "100%",
    marginTop: 10, // Space above filter section
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  filtersTitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-bold",
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 12,
    marginLeft: 8, // Align with card padding
  },
  filtersScrollContainer: {
    paddingLeft: 8, // Start first card with some padding
    paddingRight: 16, // Ensure last card has space
    backgroundColor: "transparent",
  },
  filterCardBase: {
    width: 140, // Fixed width for filter cards
    height: 180, // Fixed height
    borderRadius: 16, // Rounded corners
    marginRight: 12, // Margin between filter cards
    overflow: "hidden", // Clip image and overlay
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Glass effect
    borderColor: "rgba(255, 255, 255, 0.2)", // Subtle border
    borderWidth: 1,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
    justifyContent: "flex-end", // Aligns name to bottom
    position: "relative", // For icon overlay and border
  },
  selectedFilterCard: {
    // Highlight selected card
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  selectedFilterBorderLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 20, // Much wider border
    borderRadius: 16,
    borderColor: "transparent",
    zIndex: 1,
  },
  selectedFilterBorderRight: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: 20, // Much wider border
    borderRadius: 16,
    borderColor: "transparent",
    zIndex: 1,
  },
  filterMockupImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  filterIconOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Darker semi-transparent background for icon
    padding: 6,
    borderRadius: 10, // Smaller radius for icon container
    zIndex: 2,
  },
  filterNameContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay for text
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: "100%",
    zIndex: 2,
  },
  filterNameText: {
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-medium",
    fontSize: 15, // Clean sans-serif font
    color: COLORS.iconWhite, // White or off-white text
    textAlign: "center",
    fontWeight: "600",
  },
})

export default FilterSelector
