import React, { useEffect, useRef } from "react"
import {
  View,
  Image,
  Animated,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Easing,
} from "react-native"
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { Text } from "./Themed"
import GlassCard from "./GlassCard"
import { useGlobalContext } from "../context/GlobalProvider"
import { translations } from "../assets/localizations"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

// Renk Paleti
const COLORS = {
  gradientStart: "#7F1DFF",
  gradientEnd: "#FF4FCC",
  textPrimary: "#F5F5F5",
  textSecondary: "#F5F5F5",
  iconWhite: "#FFFFFF",
  backgroundCard: "rgba(255, 255, 255, 0.15)",
  black: "#000000",
}

// Örnek resim URL'leri (her sütunda 4'er tane)
const placeholderImages = [
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=550&fit=crop",

  "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=400&h=650&fit=crop",
  "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1560321442-4b57d4e1df3c?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=580&fit=crop",

  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=520&fit=crop",
  "https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=400&h=640&fit=crop",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=480&fit=crop",
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=620&fit=crop",
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=620&fit=crop",
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=620&fit=crop",
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=620&fit=crop",
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=620&fit=crop",
]

// Dinamik yükseklikleri tanımladığımız bir 2-boyutlu dizi.
// Her alt dizi, o sütundaki 4 resim için ayrı yükseklik içeriyor.
// İsterseniz burayı istediğiniz değerlere göre güncelleyebilirsiniz.
const imageHeights: number[][] = [
  [180, 220, 260, 200, 240, 180], // 1. sütun (index 0) için yükseklikler
  [240, 180, 220, 200, 240, 180], // 2. sütun (index 1) için yükseklikler
  [200, 260, 180, 220, 200, 260], // 3. sütun (index 2) için yükseklikler
]

interface FlowingImagesProps {
  onPickImage: () => void
  onTakePhoto: () => void
}

const FlowingImages: React.FC<FlowingImagesProps> = ({
  onPickImage,
  onTakePhoto,
}) => {
  const { myLang } = useGlobalContext()

  // Translation helper function
  const getTranslations = () => {
    const validLangs = ["tr", "german", "russian", "eng"] as const
    const currentLang = validLangs.includes(myLang as any) ? myLang : "eng"
    return (translations as any)[currentLang] || (translations as any).eng
  }

  const t = getTranslations()

  // 3 adet Animated.Value (üç sütun için)
  // Hepsini başlangıçta 0 olarak tanımlıyoruz.
  const animatedValues = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current

  const columnWidth = screenWidth / 3

  useEffect(() => {
    // "ortadaki" sütundaki (index === 1) animasyonu ters yönde çalıştırmak için:
    // direction = 1 ise pozitif yönde (aşağı), direction = -1 ise yukarı
    const animations = animatedValues.map((value, index) => {
      const direction = index === 1 ? 1 : -1
      // Mesafe olarak ±500 piksel kullandık; siz isterseniz 600, 800, vb. yapabilirsiniz.
      return Animated.loop(
        Animated.timing(value, {
          toValue: direction * 200,
          duration: 25000, // 15 saniyede 500px kayıyor
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        { iterations: -1 }
      )
    })

    animations.forEach((anim) => anim.start())
    return () => animations.forEach((anim) => anim.reset())
  }, [])

  // Her sütunun içeriğini bu fonksiyon üretiyor.
  const renderColumn = (columnIndex: number) => {
    // 3 resimlik blok:
    const startIndex = columnIndex * 3
    const columnImages = placeholderImages.slice(startIndex, startIndex + 6)

    // Sonsuz (loop) kaydırma için bu 4 resmi 2 kez tekrarlıyoruz:
    const duplicatedImages = [...columnImages, ...columnImages]

    return (
      <Animated.View
        key={columnIndex}
        style={[
          styles.imageColumn,
          {
            width: columnWidth,
            transform: [{ translateY: animatedValues[columnIndex] }],
          },
        ]}
        // Performansı daha da iyileştirmek isterseniz şu iki props'u ekleyebilirsiniz:
        // shouldRasterizeIOS={true}
        // renderToHardwareTextureAndroid={true}
      >
        {duplicatedImages.map((imageUrl, idx) => {
          // idx % 4 → orijinal 4 resme döner. Bu sayede her döngüde aynı yükseklik kullanılıyor.
          const baseIndex = idx % 4
          const height = imageHeights[columnIndex][baseIndex]

          return (
            <View
              key={`${columnIndex}-${idx}`}
              style={styles.flowingImageContainer}
            >
              <Image
                source={{ uri: imageUrl }}
                style={[styles.flowingImage, { height }]}
              />
            </View>
          )
        })}
      </Animated.View>
    )
  }

  return (
    <View style={styles.flowingImagesContainer}>
      {[0, 1, 2].map(renderColumn)}

      {/* Üstten kararan degrade */}
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0.4)", "transparent"]}
        style={styles.topGradientOverlay}
        pointerEvents="none"
      />

      {/* Alttan kararan degrade */}
      <LinearGradient
        colors={["transparent", "rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.9)"]}
        style={styles.bottomGradientOverlay}
        pointerEvents="none"
      />

      {/* Ortadaki cam kart */}
      <View style={styles.centerContentOverlay}>
        <View style={styles.uploadPromptCard}>
          <LinearGradient
            colors={[
              "rgba(55, 1, 125, 0.8)", // Purple with low opacity
              "rgba(100, 35, 82, 0.4)", // Pink with low opacity
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradientBackground}
          />
          <View style={styles.cardContent}>
            <View>
              <GlassCard>
                <FontAwesome6
                  name="wand-magic-sparkles"
                  size={28}
                  color={COLORS.iconWhite}
                />
              </GlassCard>
            </View>
            <Text style={styles.uploadTitle}>{t.startYourCreation}</Text>
            <Text style={styles.uploadSubtitle}>{t.pickImageSubtitle}</Text>
            <View style={styles.uploadButtonsContainer}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={onPickImage}
              >
                <FontAwesome5
                  name="images"
                  size={20}
                  color={COLORS.iconWhite}
                />
                <Text style={styles.uploadButtonText}>{t.fromGallery}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={onTakePhoto}
              >
                <FontAwesome5
                  name="camera"
                  size={20}
                  color={COLORS.iconWhite}
                />
                <Text style={styles.uploadButtonText}>{t.takePhoto}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  glassCardBase: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 20,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
    width: "100%",
  },
  flowingImagesContainer: {
    position: "absolute",
    width: "100%",
    height: screenHeight,
    flexDirection: "row",
    overflow: "hidden",
  },
  imageColumn: {
    flex: 1,
    paddingHorizontal: 2,
  },
  flowingImageContainer: {
    marginBottom: 8,
  },
  flowingImage: {
    width: "100%",
    borderRadius: 12,
    resizeMode: "cover",
  },
  topGradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    zIndex: 2,
  },
  bottomGradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    zIndex: 2,
  },
  centerContentOverlay: {
    position: "absolute",
    top: "45%",
    left: 0,
    right: 0,
    transform: [{ translateY: -150 }],
    zIndex: 3,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  uploadPromptCard: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "rgba(13, 13, 13, 0.95)", // Much less transparent
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(127, 29, 255, 0.3)", // Purple border
    shadowColor: COLORS.gradientStart,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
    position: "relative",
    overflow: "hidden",
  },
  uploadTitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-medium",
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  uploadSubtitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
    maxWidth: "90%",
    opacity: 0.9,
  },
  uploadButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
    paddingHorizontal: 20,
    gap: 12,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(127, 29, 255, 0.5)", // Theme color background
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(127, 29, 255, 0.4)", // Theme color border
    flex: 1,
    justifyContent: "center",
    shadowColor: COLORS.gradientStart,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  uploadButtonText: {
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-medium",
    fontSize: 12,
    color: COLORS.textPrimary,
    marginLeft: 10,
    fontWeight: "600",
  },
  cardGradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  cardContent: {
    position: "relative",
    zIndex: 1,
    alignItems: "center",
    width: "100%",
  },
})

export default FlowingImages
