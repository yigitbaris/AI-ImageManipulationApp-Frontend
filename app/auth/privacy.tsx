import { StyleSheet, ScrollView, Image, Platform } from "react-native"
import { Text, View } from "@/components/Themed"
import { SafeAreaView } from "react-native-safe-area-context"

const Privacy = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Background Image */}
      <Image
        source={require("../../assets/images/gradient-bg.png")}
        style={styles.backgroundImage}
      />

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.textWrapper}>
          <Text style={styles.privacyTitle}>Privacy Policy</Text>
          {/* You can add more content here below */}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Privacy

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // fallback background
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrapper: {
    backgroundColor: "transparent",
    alignItems: "center",
  },
  privacyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F5F5F5",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-bold",
    textAlign: "center",
  },
})
