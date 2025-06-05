import React, { useRef, useEffect, useState } from "react"
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Animated,
  Modal,
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
import { COLORS } from "@/constants/Colors"

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
  const t = (() => {
    const validLanguages = ["tr", "german", "russian", "eng"] as const
    const currentLang = validLanguages.includes(myLang as any) ? myLang : "eng"
    return translations[currentLang as keyof typeof translations]
  })()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const blurAnimation = useRef(new Animated.Value(0)).current
  const lottieRef = useRef<LottieView>(null)

  useEffect(() => {
    if (isLoading) {
      Animated.timing(blurAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start()
      lottieRef.current?.play()
    } else {
      Animated.timing(blurAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start()
      lottieRef.current?.reset()
    }
  }, [isLoading])

  const handleDownload = async () => {
    if (!result || !cleanBase64ForDisplay) return
    try {
      const isAvailable = await Sharing.isAvailableAsync()
      if (!isAvailable) {
        Alert.alert(t.sharingNotAvailable, t.sharingNotAvailableDesc)
        return
      }
      const base64Data = cleanBase64ForDisplay(
        result.processedImage || result.image || result.data
      )
      const filename = `ai_generated_${Date.now()}.jpg`
      const fileUri = FileSystem.documentDirectory + filename
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      })
      await Sharing.shareAsync(fileUri, {
        mimeType: "image/jpeg",
        dialogTitle: "Save or Share AI Generated Image",
      })
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
      const { status } = await MediaLibrary.requestPermissionsAsync()
      if (status !== "granted") {
        Alert.alert(t.permissionDenied, t.photoLibraryPermissionDesc)
        return
      }
      const base64Data = cleanBase64ForDisplay(
        result.processedImage || result.image || result.data
      )
      const filename = `ai_generated_${Date.now()}.jpg`
      const fileUri = FileSystem.documentDirectory + filename
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      })
      await MediaLibrary.saveToLibraryAsync(fileUri)
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
    // Eğer AI sonucu geldiyse, o resmi gösterelim
    if (result && cleanBase64ForDisplay) {
      return (
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Image
            source={{
              uri: `data:image/jpeg;base64,${cleanBase64ForDisplay(
                result.processedImage || result.image || result.data
              )}`,
            }}
            style={styles.imagePreview}
          />
        </TouchableOpacity>
      )
    }

    // Yoksa orijinal resmi göster, blur ekle
    return (
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <Animated.View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.imagePreview}
            blurRadius={isLoading ? 10 : 0}
          />
        </Animated.View>
      </TouchableOpacity>
    )
  }

  const renderActionButtons = () => {
    if (result) {
      return (
        <View style={styles.resultActionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDownload}
          >
            <FontAwesome5 name="share" size={16} color={COLORS.textWhite} />
            <Text style={styles.actionButtonText}>{t.saveShare}</Text>
          </TouchableOpacity>
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.actionButton}
          >
            <TouchableOpacity
              onPress={handleInstall}
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <FontAwesome5
                name="download"
                size={16}
                color={COLORS.textWhite}
              />
              <Text style={styles.actionButtonText}>{t.install}</Text>
            </TouchableOpacity>
          </LinearGradient>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={onDeleteResult}
          >
            <FontAwesome5 name="trash" size={16} color={COLORS.textWhite} />
            <Text style={styles.actionButtonText}>{t.delete}</Text>
          </TouchableOpacity>
        </View>
      )
    }

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

  return (
    <>
      {/* Tam Ekran Modali */}
      <Modal
        visible={isModalVisible}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Sol üst köşedeki X ikonu */}
          <TouchableOpacity
            style={styles.closeIconContainer}
            onPress={() => setIsModalVisible(false)}
          >
            <FontAwesome5 name="times" size={28} color={COLORS.textWhite} />
          </TouchableOpacity>

          {/* Resim */}
          {result && cleanBase64ForDisplay ? (
            <Image
              source={{
                uri: `data:image/jpeg;base64,${cleanBase64ForDisplay(
                  result.processedImage || result.image || result.data
                )}`,
              }}
              style={styles.fullscreenImage}
            />
          ) : (
            <Image source={{ uri: imageUri }} style={styles.fullscreenImage} />
          )}
        </View>
      </Modal>

      {/* Asıl Kart İçeriği */}
      <GlassCard style={styles.imagePreviewCard}>
        <View style={styles.imageWrapper}>
          {renderImageContent()}

          {isLoading && (
            <View style={styles.lottieContainer}>
              <LottieView
                ref={lottieRef}
                source={require("../assets/Animation - 1748955911416.json")}
                style={styles.lottieAnimation}
                loop
                autoPlay={false}
              />
            </View>
          )}
        </View>

        {renderActionButtons()}
      </GlassCard>
    </>
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

  // --- Modal / Tam ekran stili ---
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundDarker,
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  closeIconContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 30,
    left: 20,
    zIndex: 2,
    backgroundColor: "rgba(13,13,13,0.5)", // COLORS.backgroundDark %50 opaklık
    borderRadius: 20,
    padding: 8,
  },
  // ----------------------------------

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
    color: COLORS.textWhite,
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
    backgroundColor: "rgba(127,29,255,0.8)", // COLORS.glassBorder %80 opaklık
    borderRadius: 16,
    gap: 6,
  },
  deleteButton: {
    backgroundColor: "rgba(255,0,0,0.7)",
  },
  actionButtonText: {
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-bold",
    fontSize: 14,
    color: COLORS.textWhite,
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
