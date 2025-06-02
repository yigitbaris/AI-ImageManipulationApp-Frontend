import React from "react"
import { View, StyleSheet } from "react-native"

// Updated Color Palette (matching generate.tsx)
const COLORS = {
  backgroundCard: "rgba(255, 255, 255, 0.15)", // Semi-transparent white for glass
  black: "#000000",
}

interface GlassCardProps {
  children: React.ReactNode
  style?: any
}

const GlassCard: React.FC<GlassCardProps> = ({ children, style }) => {
  return <View style={[styles.glassCardBase, style]}>{children}</View>
}

const styles = StyleSheet.create({
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
})

export default GlassCard
