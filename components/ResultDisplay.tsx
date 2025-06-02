import React from "react"
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"
import { Text } from "./Themed"
import GlassCard from "./GlassCard"

// Updated Color Palette (matching generate.tsx)
const COLORS = {
  textPrimary: "#F5F5F5", // Off-white for headings
  iconWhite: "#FFFFFF",
}

interface ResultDisplayProps {
  result: any
  onDeleteResult: () => void
  cleanBase64ForDisplay: (base64Data: string) => string
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  result,
  onDeleteResult,
  cleanBase64ForDisplay,
}) => {
  if (!result || !(result.processedImage || result.image || result.data)) {
    return null
  }

  return (
    <GlassCard style={styles.resultDisplayCard}>
      <Text style={styles.resultTitle}>✨ AI Masterpiece ✨</Text>
      <View style={styles.resultImageWrapper}>
        <Image
          source={{
            uri: `data:image/jpeg;base64,${cleanBase64ForDisplay(
              result.processedImage || result.image || result.data
            )}`,
          }}
          style={styles.resultImage}
        />
        <TouchableOpacity
          style={styles.deleteResultButton}
          onPress={onDeleteResult}
        >
          <FontAwesome5 name="times" size={16} color={COLORS.iconWhite} />
        </TouchableOpacity>
      </View>
    </GlassCard>
  )
}

const styles = StyleSheet.create({
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
})

export default ResultDisplay
