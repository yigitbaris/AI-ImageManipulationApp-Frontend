import React, { useRef, useEffect } from "react"
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Animated,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons"
import { Text } from "./Themed"
import GlassCard from "./GlassCard"
import LottieView from "lottie-react-native"
import * as Sharing from "expo-sharing"
import * as FileSystem from "expo-file-system"
import * as MediaLibrary from "expo-media-library"
import Toast from "react-native-toast-message"
import { useGlobalContext } from "../context/GlobalProvider"
import { translations } from "../assets/localizations"

// Updated Color Palette (matching generate.tsx)
const COLORS = {
  gradientStart: "#7F1DFF", // Purple
  gradientEnd: "#FF4FCC", // Pink
  iconWhite: "#FFFFFF",
  textPrimary: "#F5F5F5", // Off-white for headings
  black: "#000000",
}

interface ImagePreviewProps {
  imageUri: string
  onChangePhoto: () => void
  isLoading?: boolean
  result?: any
  onDeleteResult?: () => void
  cleanBase64ForDisplay?: (base64Data: string) => string
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUri,
  onChangePhoto,
  isLoading = false,
  result = null,
  onDeleteResult,
  cleanBase64ForDisplay,
}) => {
  const { myLang } = useGlobalContext()

  const getTranslations = () => {
    const validLanguages = ["tr", "german", "russian", "eng"] as const
    const currentLang = validLanguages.includes(myLang as any) ? myLang : "eng"
    return translations[currentLang as keyof typeof translations]
  }

  const t = getTranslations()

  const blurAnimation = useRef(new Animated.Value(0)).current
  const lottieRef = useRef<LottieView>(null)

  useEffect(() => {
    if (isLoading) {
      // Start blur animation
      Animated.timing(blurAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start()

      // Start Lottie animation
      lottieRef.current?.play()
    } else {
      // Stop blur animation
      Animated.timing(blurAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start()

      // Reset Lottie animation
      lottieRef.current?.reset()
    }
  }, [isLoading])

  const handleDownload = async () => {
    if (!result || !cleanBase64ForDisplay) return

    try {
      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync()
      if (!isAvailable) {
        Alert.alert(t.sharingNotAvailable, t.sharingNotAvailableDesc)
        return
      }

      // Get the base64 data
      const base64Data = cleanBase64ForDisplay(
        result.processedImage || result.image || result.data
      )

      // Create a temporary file
      const filename = `ai_generated_${Date.now()}.jpg`
      const fileUri = FileSystem.documentDirectory + filename

      // Write the base64 data to file
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      })

      // Share the file (this allows user to save to gallery or share)
      await Sharing.shareAsync(fileUri, {
        mimeType: "image/jpeg",
        dialogTitle: "Save or Share AI Generated Image",
      })

      // Clean up temporary file after a short delay
      setTimeout(async () => {
        try {
          await FileSystem.deleteAsync(fileUri, { idempotent: true })
        } catch (error) {
          console.log("Could not delete temp file:", error)
        }
      }, 5000)

      Toast.show({
        type: "success",
        text1: t.imageReady,
        text2: t.chooseSaveOrShare,
        position: "top",
      })
    } catch (error) {
      console.error("Share error:", error)
      Toast.show({
        type: "error",
        text1: t.shareFailed,
        text2: t.couldNotPrepareImage,
        position: "top",
      })
    }
  }

  const handleInstall = async () => {
    if (!result || !cleanBase64ForDisplay) return

    try {
      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync()
      if (status !== "granted") {
        Alert.alert(t.permissionDenied, t.photoLibraryPermissionDesc)
        return
      }

      // Get the base64 data
      const base64Data = cleanBase64ForDisplay(
        result.processedImage || result.image || result.data
      )

      // Create a temporary file
      const filename = `ai_generated_${Date.now()}.jpg`
      const fileUri = FileSystem.documentDirectory + filename

      // Write the base64 data to file
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      })

      // Save the image to gallery
      await MediaLibrary.saveToLibraryAsync(fileUri)

      // Clean up temporary file after a short delay
      setTimeout(async () => {
        try {
          await FileSystem.deleteAsync(fileUri, { idempotent: true })
        } catch (error) {
          console.log("Could not delete temp file:", error)
        }
      }, 5000)

      Toast.show({
        type: "success",
        text1: t.imageSaved,
        text2: t.artworkSavedToGallery,
        position: "top",
      })
    } catch (error) {
      console.error("Install error:", error)
      Toast.show({
        type: "error",
        text1: t.saveFailed,
        text2: t.couldNotSaveToGallery,
        position: "top",
      })
    }
  }

  const renderImageContent = () => {
    if (result && cleanBase64ForDisplay) {
      // Show result image
      return (
        <Image
          source={{
            uri: `data:image/jpeg;base64,${cleanBase64ForDisplay(
              result.processedImage || result.image || result.data
            )}`,
          }}
          style={styles.imagePreview}
        />
      )
    } else {
      // Show original image with potential blur
      return (
        <Animated.View
          style={[
            styles.imageContainer,
            // {
            //   opacity: blurAnimation.interpolate({
            //     inputRange: [0, 1],
            //     outputRange: [1, 0.3],
            //   }),
            // },
          ]}
        >
          <Image
            source={{ uri: imageUri }}
            style={styles.imagePreview}
            blurRadius={isLoading ? 10 : 0} // ← Apply actual blur
          />
        </Animated.View>
      )
    }
  }

  const renderActionButtons = () => {
    if (result) {
      // Show download, install, and delete buttons for result
      return (
        <View style={styles.resultActionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDownload}
          >
            <FontAwesome5 name="share" size={16} color={COLORS.iconWhite} />
            <Text style={styles.actionButtonText}>{t.saveShare}</Text>
          </TouchableOpacity>
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.installButtonGradient}
          >
            <FontAwesome5 name="download" size={16} color={COLORS.iconWhite} />
            <Text style={styles.actionButtonText}>{t.install}</Text>
          </LinearGradient>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={onDeleteResult}
          >
            <FontAwesome5 name="trash" size={16} color={COLORS.iconWhite} />
            <Text style={styles.actionButtonText}>{t.delete}</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      // Show change photo button
      return (
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.changePhotoGradient}
        >
          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={onChangePhoto}
          >
            <Text style={styles.changePhotoText}>{t.changePhoto}</Text>
          </TouchableOpacity>
        </LinearGradient>
      )
    }
  }

  return (
    <GlassCard style={styles.imagePreviewCard}>
      <View style={styles.imageWrapper}>
        {renderImageContent()}

        {/* Lottie Animation Overlay */}
        {isLoading && (
          <View style={styles.lottieContainer}>
            <LottieView
              ref={lottieRef}
              source={require("../assets/Animation - 1748955911416.json")}
              style={styles.lottieAnimation}
              loop={true}
              autoPlay={false}
            />
          </View>
        )}

        {/* Result Title */}
        {/* {result && (
          <View style={styles.resultTitleContainer}>
            <Text style={styles.resultTitle}>✨ AI Masterpiece ✨</Text>
          </View>
        )} */}
      </View>

      {renderActionButtons()}
    </GlassCard>
  )
}

const styles = StyleSheet.create({
  imagePreviewCard: {
    padding: 8,
    alignItems: "center",
  },
  imageWrapper: {
    width: "100%",
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  imageContainer: {
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    resizeMode: "cover",
  },
  blurOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 16,
  },
  lottieContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  lottieAnimation: {
    width: 150,
    height: 150,
  },
  resultTitleContainer: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1,
  },
  resultTitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-bold",
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    textShadowColor: COLORS.black,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  changePhotoGradient: {
    borderRadius: 16,
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
  resultActionsContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 8,
    flexWrap: "wrap",
  },
  actionButton: {
    flex: 1,
    minWidth: "30%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "rgba(127, 29, 255, 0.8)",
    borderRadius: 16,
    gap: 6,
  },
  deleteButton: {
    backgroundColor: "rgba(255, 59, 48, 0.8)",
  },
  actionButtonText: {
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-bold",
    fontSize: 14,
    color: COLORS.iconWhite,
    fontWeight: "600",
  },
  installButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 6,
  },
})

export default ImagePreview
