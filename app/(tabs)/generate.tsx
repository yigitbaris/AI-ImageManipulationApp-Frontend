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
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { useState } from "react"
import React from "react"
import Toast from "react-native-toast-message"
import { LinearGradient } from "expo-linear-gradient"
import * as FileSystem from "expo-file-system"
import FlowingImages from "@/components/FlowingImages"
import GlassCard from "@/components/GlassCard"
import FilterSelector from "@/components/FilterSelector"
import ImagePreview from "@/components/ImagePreview"
import ResultDisplay from "@/components/ResultDisplay"
// Updated Color Palette
const COLORS = {
  background: "#121212", // Near-black
  backgroundCard: "rgba(255, 255, 255, 0.15)", // Semi-transparent white for glass
  gradientStart: "#7F1DFF", // Purple
  gradientEnd: "#FF4FCC", // Pink
  textPrimary: "#F5F5F5", // Off-white for headings
  textSecondary: "#F5F5F5", // Off-white for body/labels
  iconWhite: "#FFFFFF",
  secondaryHighlight: "#FF6FD8", // Light pink for badges/highlights
  borderColor: "rgba(127, 29, 255, 0.3)", // Purple at 30% opacity for borders
  white: "#FFFFFF",
  black: "#000000",
  error: "#FF3B30",
  info: "#007AFF",
  success: "#34C759",
  grey: "#8E8E93",
}

interface Filter {
  id: number
  name: string
  description: string
  icon: string
  mockup: string | any
}

const filters: Filter[] = [
  {
    id: 1,
    name: "Ghibli",
    description: "Transform into Studio Ghibli artwork",
    icon: "paint-brush",
    mockup: require("../../assets/images/ghibli.png"),
  },
  {
    id: 2,
    name: "Anime",
    description: "Convert your photo into anime style art",
    icon: "user-astronaut",
    mockup:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format",
  },
  {
    id: 3,
    name: "Oil Painting",
    description: "Turn your photo into an oil painting",
    icon: "palette",
    mockup:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&auto=format",
  },
  {
    id: 4,
    name: "Pencil Sketch",
    description: "Convert your photo into a detailed pencil drawing",
    icon: "pencil-alt",
    mockup:
      "https://images.unsplash.com/photo-1599074902614-a3fb3927b6a5?w=500&auto=format",
  },
]

export default function Generate() {
  const [image, setImage] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<Filter | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const API_BASE_URL = "http://192.168.111.2:3000"

  const convertImageToBase64 = async (imageUri: string): Promise<string> => {
    try {
      // Raw base64 elde edin
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      })

      // “data:image/jpeg;base64,” öneki ekleyin
      // NOT: Eğer fotoğrafınız .png ise “image/png” yazmalısınız
      const dataUri = `data:image/jpeg;base64,${base64.trim()}`
      return dataUri
    } catch (error) {
      console.error("Failed to convert image to base64:", error)
      Toast.show({
        type: "error",
        text1: "Conversion Error",
        text2: "Failed to prepare image.",
      })
      throw new Error("Failed to convert image to base64")
    }
  }

  const cleanBase64ForDisplay = (base64Data: string): string => {
    let cleaned = base64Data.replace(/"/g, "").trim()
    if (cleaned.startsWith("data:image")) {
      cleaned = cleaned.split(",")[1] || cleaned
    }
    cleaned = cleaned.replace(/\s/g, "")
    return cleaned
  }

  const applyFilterAPI = async (imageBase64: string, filterName: string) => {
    try {
      console.log("filterName", filterName)
      console.log("imageBase64", imageBase64.slice(0, 100))
      const response = await fetch(
        `${API_BASE_URL}/api/v1/image-manipulation/filter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: imageBase64,
            filter: filterName.toLowerCase(), // Ensure filter name is lowercase if API expects it
          }),
        }
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.msg || `API Error: ${response.status}`)
      }
      return data
    } catch (error: any) {
      console.error("API Error details:", error)
      Toast.show({
        type: "error",
        text1: "API Error",
        text2: error.message || "Failed to connect to server",
      })
      throw new Error(error.message || "Failed to connect to server")
    }
  }

  const handleGenerate = async () => {
    if (!selectedFilter) {
      Toast.show({
        type: "error",
        text1: "No Filter Selected",
        text2: "Please choose an AI filter.",
        position: "top",
      })
      return
    }

    if (!image) {
      Toast.show({
        type: "error",
        text1: "No Image Selected",
        text2: "Please select or take a photo.",
        position: "top",
      })
      return
    }

    setIsLoading(true)
    setResult(null)
    Toast.show({
      type: "info",
      text1: "🎨 Processing...",
      text2: "AI magic is happening!",
      position: "top",
      visibilityTime: 3000,
    })

    try {
      const imageBase64 = await convertImageToBase64(image)
      const apiResult = await applyFilterAPI(imageBase64, selectedFilter.name)

      if (apiResult.success) {
        setResult(apiResult)
        Toast.show({
          type: "success",
          text1: "✨ Magic Complete!",
          text2: "Your AI artwork is ready.",
          position: "top",
        })
      } else {
        Toast.show({
          type: "error",
          text1: "Filter Failed",
          text2: apiResult.msg || "Something went wrong.",
          position: "top",
        })
      }
    } catch (error: any) {
      // Error already shown by applyFilterAPI or convertImageToBase64
    } finally {
      setIsLoading(false)
    }
  }

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // As per original, can be changed
        quality: 0.8, // Slightly reduced for performance, adjust as needed
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri)
        setResult(null) // Clear previous result when new image is picked
      }
    } catch (error) {
      console.error("ImagePicker Error:", error)
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Could not open gallery.",
      })
    }
  }

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Camera permission is required to take photos."
        )
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false, // As per original
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri)
        setResult(null) // Clear previous result
      }
    } catch (error) {
      console.error("Camera Error:", error)
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Could not open camera.",
      })
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/images/gradient-bg.png")}
        style={styles.backgroundImage}
      />
      {/* <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topGradientBar}
      /> */}

      <ScrollView
        style={styles.contentScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {!image && (
          <View style={styles.headerContainer}>
            <GlassCard style={styles.magicIconContainer}>
              <FontAwesome6
                name="wand-magic-sparkles"
                size={28}
                color={COLORS.iconWhite}
              />
            </GlassCard>
          </View>
        )}

        {!image ? (
          <FlowingImages onPickImage={pickImage} onTakePhoto={takePhoto} />
        ) : (
          <>
            <View style={{ marginTop: 20 }} />
            <ImagePreview
              imageUri={image}
              onChangePhoto={() => {
                setImage(null)
                setResult(null)
                setSelectedFilter(null)
              }}
            />

            <FilterSelector
              filters={filters}
              selectedFilter={selectedFilter}
              onFilterSelect={setSelectedFilter}
            />

            <ResultDisplay
              result={result}
              onDeleteResult={() => setResult(null)}
              cleanBase64ForDisplay={cleanBase64ForDisplay}
            />
          </>
        )}
      </ScrollView>

      {image && (
        <View style={styles.generateButtonContainer}>
          <TouchableOpacity
            onPress={handleGenerate}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                isLoading
                  ? [COLORS.grey, COLORS.grey]
                  : [COLORS.gradientStart, COLORS.gradientEnd]
              }
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[
                styles.generateButton,
                isLoading && styles.generateButtonDisabled,
              ]}
            >
              {isLoading ? (
                <>
                  <FontAwesome5
                    name="spinner"
                    size={20}
                    color={COLORS.iconWhite}
                    style={styles.loadingIcon}
                  />
                  <Text style={styles.generateButtonText}>Processing...</Text>
                </>
              ) : (
                <>
                  <FontAwesome6
                    name="wand-magic-sparkles"
                    size={20}
                    color={COLORS.iconWhite}
                  />
                  <Text style={styles.generateButtonText}>Generate Photo</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
      <Toast />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Near-black background
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  topGradientBar: {
    height: 0, // Adjust as needed
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  contentScroll: {
    flex: 1,
    marginTop: 0, // Space for gradient bar to be visible and for magic icon
  },
  scrollContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 120, // Space for the generate button
    alignItems: "center", // Center content like upload prompt
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20, // Pushes icon down from very top
    marginBottom: 20, // Space below icon
    zIndex: 1, // Ensure it's above the gradient
    backgroundColor: "transparent",
  },
  magicIconContainer: {
    // Frosted glass container for icon
    padding: 12,
    borderRadius: 50, // Circular
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)", // Thin white border
    backgroundColor: "transparent", // Glass effect
    shadowColor: COLORS.gradientStart,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5, // For Android shadow
  },

  // Glass Card Base Style
  glassCardBase: {
    backgroundColor: COLORS.backgroundCard, // Semi-transparent white
    borderRadius: 20, // Rounded corners
    padding: 16, // Generous padding
    shadowColor: COLORS.black, // Soft shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8, // For Android
    marginBottom: 20, // Consistent margin
    width: "100%", // Make cards take full width of container
  },

  // Image Preview Styles
  imagePreviewCard: {
    padding: 8, // Less padding to make image more prominent
    alignItems: "center",
  },
  imagePreview: {
    width: "100%",
    height: 300, // Adjust as needed
    borderRadius: 16, // Rounded corners for the image itself
    marginBottom: 12,
    resizeMode: "cover", // Or 'contain' based on preference
  },
  changePhotoGradient: {
    borderRadius: 16, // Match button's border radius
    width: "100%",
  },
  changePhotoButton: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  changePhotoText: {
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-bold",
    fontSize: 16,
    color: COLORS.iconWhite,
    fontWeight: "bold",
  },

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
    // For backdrop-blur, use BlurView here as well
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
    // Making glass panel more opaque
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    // Applying purple-pink gradient border (simulated with an overlay view or actual border)
    // The LinearGradient component "selectedFilterBorder" handles this visually
  },
  selectedFilterBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16, // Match card's border radius
    borderWidth: 2, // Thickness of the gradient border
    borderColor: "transparent", // Handled by LinearGradient
    zIndex: 1, // Ensure it's above image but below content
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

  // Result Display Styles
  resultDisplayCard: {
    marginTop: 10, // Space above result card
    padding: 12,
    alignItems: "center",
  },
  resultTitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-bold",
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  resultImageWrapper: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden", // Ensure image respects border radius
    position: "relative",
  },
  resultImage: {
    width: "100%",
    height: 350, // Adjust as needed
    resizeMode: "contain", // Or cover
  },
  deleteResultButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20, // Circular
    zIndex: 1,
  },

  // Generate Button Styles
  generateButtonContainer: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    paddingHorizontal: 30,
    paddingVertical: Platform.OS === "ios" ? 30 : 20,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: COLORS.gradientEnd,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    gap: 10,
  },
  generateButtonText: {
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-bold",
    fontSize: 16,
    color: COLORS.iconWhite,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  generateButtonDisabled: {
    opacity: 0.6,
    shadowColor: COLORS.grey,
  },
  loadingIcon: {},
})
