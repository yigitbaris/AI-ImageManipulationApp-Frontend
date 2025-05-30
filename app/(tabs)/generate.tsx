import {
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
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
    name: "ghibli",
    description: "Transform into Studio Ghibli artwork",
    icon: "paint-brush",
    mockup: require("../../assets/images/ghibli.png"),
  },
  {
    id: 2,
    name: "anime",
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
      "https://images.unsplash.com/photo-1599074914978-2946b69e5066?w=500&auto=format",
  },
]

export default function Generate() {
  const [image, setImage] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<Filter | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  // API Configuration - you can change this to your localhost URL
  const API_BASE_URL = "http://192.168.111.2:3000" // For Android emulator (change to your machine's IP for physical device)
  const AUTH_TOKEN = process.env.AUTH_TOKEN // Just the token value

  // Convert image to base64
  const convertImageToBase64 = async (imageUri: string): Promise<string> => {
    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      })
      return base64
    } catch (error) {
      throw new Error("Failed to convert image to base64")
    }
  }

  // Clean base64 data for display
  const cleanBase64ForDisplay = (base64Data: string): string => {
    // Remove any quotes, whitespace, or data URL prefix
    let cleaned = base64Data.replace(/"/g, "").trim()

    // Remove data URL prefix if present
    if (cleaned.startsWith("data:image")) {
      cleaned = cleaned.split(",")[1] || cleaned
    }

    // Remove any remaining whitespace or newlines
    cleaned = cleaned.replace(/\s/g, "")

    console.log("Cleaned base64 length:", cleaned.length)
    console.log("First 50 chars:", cleaned.substring(0, 50))
    console.log("Last 50 chars:", cleaned.substring(cleaned.length - 50))

    return cleaned
  }

  // Make API call to apply filter
  const applyFilterAPI = async (imageBase64: string, filterName: string) => {
    try {
      console.log(
        "Making API call to:",
        `${API_BASE_URL}/api/v1/image-manipulation/filter`
      )
      console.log("Filter:", filterName)
      console.log("Image size:", imageBase64.length)

      const response = await fetch(
        `${API_BASE_URL}/api/v1/image-manipulation/filter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
          body: JSON.stringify({
            image: imageBase64,
            filter: filterName,
          }),
        }
      )

      console.log("Response status:", response.status)
      const data = await response.json()
      console.log("Response data:", data)
      return data
    } catch (error) {
      console.log("API Error details:", error)
      throw new Error("Failed to connect to server")
    }
  }

  const handleGenerate = async () => {
    if (!selectedFilter) {
      Toast.show({
        type: "error",
        text1: "No Filter Selected",
        text2: "Please choose an AI filter to continue",
        position: "top",
        visibilityTime: 2000,
      })
      return
    }

    if (!image) {
      Toast.show({
        type: "error",
        text1: "No Image Selected",
        text2: "Please select a photo first",
        position: "top",
        visibilityTime: 2000,
      })
      return
    }

    try {
      setIsLoading(true)
      setResult(null)

      // Show starting animation toast
      Toast.show({
        type: "info",
        text1: "🎨 Starting AI Magic",
        text2: "Transforming your image...",
        position: "top",
        visibilityTime: 2000,
      })

      // Convert image to base64
      const imageBase64 = await convertImageToBase64(image)

      // Make API call
      const apiResult = await applyFilterAPI(imageBase64, selectedFilter.name)

      if (apiResult.success) {
        setResult(apiResult)
        console.log("API Success! Result structure:", {
          hasProcessedImage: !!apiResult.processedImage,
          hasImage: !!apiResult.image,
          hasData: !!apiResult.data,
          keys: Object.keys(apiResult),
          imageLength:
            apiResult.processedImage?.length ||
            apiResult.image?.length ||
            apiResult.data?.length ||
            0,
        })
        Toast.show({
          type: "success",
          text1: "✨ Magic Complete!",
          text2: "Your AI artwork is ready",
          position: "top",
          visibilityTime: 3000,
        })
      } else {
        Toast.show({
          type: "error",
          text1: "Filter Failed",
          text2: apiResult.msg || "Something went wrong",
          position: "top",
          visibilityTime: 3000,
        })
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to apply filter",
        position: "top",
        visibilityTime: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
      console.log("Image selected:", result.assets[0].uri) // Debug log
    }
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()

    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
      })

      if (!result.canceled) {
        setImage(result.assets[0].uri)
        console.log("Photo taken:", result.assets[0].uri) // Debug log
      }
    } else {
      console.log("Camera permission denied")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Magic</Text>
        <Text style={styles.subtitle}>Transform your photos with AI</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {!image ? (
          <View style={styles.uploadContainer}>
            <View style={styles.uploadIconContainer}>
              <LinearGradient
                colors={["#673ab7", "#9c27b0", "#e91e63"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.uploadIconGradient}
              >
                <FontAwesome5 name="magic" size={40} color="#fff" />
              </LinearGradient>
            </View>

            <Text style={styles.uploadTitle}>Create AI Magic</Text>
            <Text style={styles.uploadSubtitle}>
              Transform your photos with powerful AI filters
            </Text>
            <Text style={styles.uploadDescription}>
              Upload a photo from your gallery or take a new one to get started
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={pickImage}>
                <View style={styles.buttonIconContainer}>
                  <FontAwesome5 name="images" size={24} color="#673ab7" />
                </View>
                <Text style={styles.buttonText}>Gallery</Text>
                <Text style={styles.buttonSubtext}>Choose from photos</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={takePhoto}>
                <View style={styles.buttonIconContainer}>
                  <FontAwesome5 name="camera" size={24} color="#673ab7" />
                </View>
                <Text style={styles.buttonText}>Camera</Text>
                <Text style={styles.buttonSubtext}>Take a new photo</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <FontAwesome5 name="bolt" size={16} color="#673ab7" />
                <Text style={styles.featureText}>Instant Processing</Text>
              </View>
              <View style={styles.featureItem}>
                <FontAwesome5 name="palette" size={16} color="#673ab7" />
                <Text style={styles.featureText}>Multiple Styles</Text>
              </View>
              <View style={styles.featureItem}>
                <FontAwesome5 name="download" size={16} color="#673ab7" />
                <Text style={styles.featureText}>High Quality</Text>
              </View>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.changePhotoButton}
                onPress={() => setImage(null)}
              >
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.filtersContainer}>
              <Text style={styles.filtersTitle}>Choose an AI Filter</Text>
              <View style={styles.filtersGrid}>
                {filters.map((filter) => (
                  <TouchableOpacity
                    key={filter.id}
                    style={[
                      styles.filterCard,
                      selectedFilter?.id === filter.id
                        ? styles.selectedFilterCard
                        : undefined,
                    ]}
                    onPress={() => setSelectedFilter(filter)}
                  >
                    <View style={styles.filterImageContainer}>
                      <Image
                        source={
                          typeof filter.mockup === "string"
                            ? { uri: filter.mockup }
                            : filter.mockup
                        }
                        style={styles.filterMockupImage}
                      />
                      <View
                        style={[
                          styles.filterOverlay,
                          selectedFilter?.id === filter.id &&
                            styles.selectedFilterOverlay,
                        ]}
                      >
                        {selectedFilter?.id === filter.id && (
                          <LinearGradient
                            colors={[
                              "rgba(103, 58, 183, 0.8)",
                              "rgba(238, 10, 124, 0.2)",
                              "transparent",
                              "rgba(238, 10, 124, 0.2)",
                              "rgba(103, 58, 183, 0.8)",
                            ]}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            locations={[0, 0.2, 0.5, 0.8, 1]}
                            style={styles.gradientOverlay}
                          />
                        )}
                      </View>
                      <View
                        style={[
                          styles.filterIconContainer,
                          selectedFilter?.id === filter.id &&
                            styles.selectedFilterIconContainer,
                        ]}
                      >
                        <FontAwesome5
                          name={filter.icon}
                          size={16}
                          color={
                            selectedFilter?.id === filter.id
                              ? "#fff"
                              : "#673ab7"
                          }
                        />
                      </View>
                    </View>
                    <View
                      style={[
                        styles.filterTextContainer,
                        selectedFilter?.id === filter.id &&
                          styles.selectedFilterTextContainer,
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterName,
                          selectedFilter?.id === filter.id &&
                            styles.selectedFilterText,
                        ]}
                        numberOfLines={1}
                      >
                        {filter.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {result && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>
                  ✨ Your AI-Generated Image
                </Text>

                <View style={styles.resultImageContainer}>
                  {result.processedImage || result.image || result.data ? (
                    <>
                      <Image
                        source={{
                          uri: `data:image/jpeg;base64,${cleanBase64ForDisplay(
                            result.processedImage || result.image || result.data
                          )}`,
                        }}
                        style={styles.resultImage}
                        onError={(error) =>
                          console.log("Image load error:", error.nativeEvent)
                        }
                        onLoad={() => console.log("Image loaded successfully")}
                      />

                      <TouchableOpacity
                        style={styles.deleteImageButton}
                        onPress={() => {
                          setResult(null)
                          Toast.show({
                            type: "info",
                            text1: "Image Deleted",
                            text2: "Generated image has been removed",
                            position: "top",
                            visibilityTime: 2000,
                          })
                        }}
                      >
                        <FontAwesome5 name="times" size={16} color="#fff" />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View
                      style={[styles.resultImage, styles.noImagePlaceholder]}
                    >
                      <FontAwesome5 name="image" size={50} color="#ccc" />
                      <Text style={styles.noImageText}>
                        No image data received
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.resultDetails}>
                  <View style={styles.resultInfoRow}>
                    <FontAwesome5 name="magic" size={16} color="#673ab7" />
                    <Text style={styles.resultFilterName}>
                      Filter: {selectedFilter?.name}
                    </Text>
                  </View>

                  {result.processingTime && (
                    <View style={styles.resultInfoRow}>
                      <FontAwesome5 name="clock" size={16} color="#673ab7" />
                      <Text style={styles.resultStats}>
                        Processing: {result.processingTime}ms
                      </Text>
                    </View>
                  )}

                  <View style={styles.resultButtonsContainer}>
                    <TouchableOpacity style={styles.downloadButtonLarge}>
                      <FontAwesome5 name="download" size={16} color="#fff" />
                      <Text style={styles.downloadButtonText}>
                        Save to Gallery
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.shareButton}>
                      <FontAwesome5 name="share" size={16} color="#673ab7" />
                      <Text style={styles.shareButtonText}>Share</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {image && (
        <View style={styles.generateButtonWrapper}>
          <TouchableOpacity
            onPress={handleGenerate}
            disabled={isLoading}
            activeOpacity={0.8}
            style={[
              styles.generateButton,
              isLoading && styles.generateButtonLoading,
            ]}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <FontAwesome5
                  name="magic"
                  size={18}
                  color="#fff"
                  backgroundColor="#9c27b0"
                />
                <Text style={styles.generateButtonText}>
                  Processing Magic...
                </Text>
              </View>
            ) : (
              <View style={styles.generateContainer}>
                <FontAwesome6
                  name="wand-magic-sparkles"
                  size={18}
                  color="#fff"
                  backgroundColor="#673ab7"
                />
                <Text style={styles.generateButtonText}>Generate photo</Text>
              </View>
            )}
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
    // backgroundColor: "#000",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  uploadContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  uploadIconContainer: {
    marginBottom: 30,
  },
  uploadIconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#673ab7",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  uploadTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  uploadSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  uploadDescription: {
    fontSize: 14,
    color: "#888",
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    width: 140,
    shadowColor: "#673ab7",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(103, 58, 183, 0.1)",
  },
  buttonIconContainer: {
    backgroundColor: "rgba(103, 58, 183, 0.1)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  buttonText: {
    color: "#673ab7",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  buttonSubtext: {
    color: "#888",
    fontSize: 12,
    textAlign: "center",
  },
  featuresContainer: {
    flexDirection: "row",
    gap: 30,
    marginTop: 20,
  },
  featureItem: {
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  imagePreviewContainer: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  imagePreview: {
    width: "100%",
    maxHeight: 400,
    minHeight: 200,
    borderRadius: 15,
    marginBottom: 10,
    resizeMode: "contain",
  },
  changePhotoButton: {
    width: "100%",
    padding: 10,
    backgroundColor: "#673ab7",
    borderRadius: 10,
  },
  changePhotoText: {
    color: "#ffffff",
    fontSize: 16,
  },
  filtersContainer: {
    marginTop: 20,
    backgroundColor: "transparent",
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  filtersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterCard: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    flex: 1,
    minWidth: "48%",
    maxWidth: "48%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedFilterCard: {
    backgroundColor: "#673ab7",
  },
  filterImageContainer: {
    position: "relative",
    height: 120,
    width: "100%",
  },
  filterMockupImage: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  filterOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  selectedFilterOverlay: {
    backgroundColor: "transparent",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  filterIconContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedFilterIconContainer: {
    backgroundColor: "#673ab7",
  },
  filterTextContainer: {
    padding: 12,
    backgroundColor: "white",
  },
  selectedFilterTextContainer: {
    backgroundColor: "#673ab7",
  },
  filterName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  selectedFilterText: {
    color: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 90, // Space for generate button
  },
  generateButtonWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  generateButton: {
    backgroundColor: "#673ab7",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#673ab7",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  generateButtonText: {
    color: "#fff",
    backgroundColor: "#673ab7",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  resultContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  resultImageContainer: {
    position: "relative",
    marginBottom: 20,
  },
  resultImage: {
    width: "100%",
    maxHeight: 400,
    minHeight: 200,
    borderRadius: 15,
    resizeMode: "contain",
  },
  resultOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  resultActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "rgba(255, 0, 0, 0.2)",
  },
  resultDetails: {
    marginTop: 20,
  },
  resultInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  resultFilterName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  resultStats: {
    fontSize: 14,
    color: "#666",
  },
  downloadButtonLarge: {
    backgroundColor: "#673ab7",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  downloadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  shareButton: {
    backgroundColor: "#673ab7",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resultButtonsContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  generateButtonDisabled: {
    backgroundColor: "#ccc",
  },
  noImagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: "#ccc",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteImageButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 0, 0, 0.5)",
    padding: 5,
    borderRadius: 10,
  },
  generateButtonLoading: {
    backgroundColor: "#9c27b0",
    opacity: 0.8,
  },
  loadingIcon: {
    marginRight: 10,
  },
  generateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#673ab7",
  },
})
