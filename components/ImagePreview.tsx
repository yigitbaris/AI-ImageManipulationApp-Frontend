import React from "react"
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Text } from "./Themed"
import GlassCard from "./GlassCard"

// Updated Color Palette (matching generate.tsx)
const COLORS = {
  gradientStart: "#7F1DFF", // Purple
  gradientEnd: "#FF4FCC", // Pink
  iconWhite: "#FFFFFF",
}

interface ImagePreviewProps {
  imageUri: string
  onChangePhoto: () => void
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUri,
  onChangePhoto,
}) => {
  return (
    <GlassCard style={styles.imagePreviewCard}>
      <Image source={{ uri: imageUri }} style={styles.imagePreview} />
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
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>
      </LinearGradient>
    </GlassCard>
  )
}

const styles = StyleSheet.create({
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
})

export default ImagePreview
