import { StyleSheet, ScrollView, Image, Platform } from "react-native"
import { Text, View } from "@/components/Themed"
import { SafeAreaView } from "react-native-safe-area-context"
import { translations } from "@/assets/localizations"
import { useGlobalContext } from "@/context/GlobalProvider"

const Privacy = () => {
  const { myLang } = useGlobalContext()
  const getTranslations = () => {
    const validLangs = ["tr", "german", "russian", "eng"] as const
    const currentLang = validLangs.includes(myLang as any) ? myLang : "eng"
    return (translations as any)[currentLang] || (translations as any).eng
  }

  const t = getTranslations()

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
          <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
            {t.privacy}
          </Text>
          <Text style={styles.privacyTitle}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
            enim rem, eaque quasi sapiente sit aperiam illum? Quisquam illo
            officia eaque voluptates ea. Unde praesentium expedita optio
            doloremque provident molestias nostrum necessitatibus debitis illo
            error. Neque aspernatur deleniti reiciendis doloremque enim
            dignissimos, quibusdam facere nulla velit omnis id molestiae magni
            nesciunt rem totam quod ratione, quo exercitationem magnam aut,
            deserunt nam veritatis labore! Velit in, vitae reiciendis, ut
            necessitatibus illo mollitia laborum repudiandae quaerat maiores
            provident cumque! Nisi animi inventore eius rerum laudantium! Autem
            expedita quam, soluta dicta aliquid harum nobis dolor ratione
            sapiente sed nemo nesciunt. Amet ipsum rerum ducimus quaerat sequi
            repudiandae exercitationem quae aliquam provident deserunt facilis,
            repellendus atque suscipit eius esse repellat dicta quas laboriosam
            officiis doloribus eligendi excepturi optio, minima non! Temporibus
            labore error reprehenderit sunt corrupti, ducimus minus! Ullam
            architecto, aliquam fuga odit exercitationem suscipit. Inventore
            soluta velit explicabo modi. At nobis quod voluptates eligendi est,
            corrupti, consequuntur fuga rem omnis officia voluptate id dolores,
            nam distinctio. Enim perspiciatis molestiae est fuga dolores
            necessitatibus placeat aliquid blanditiis ratione rem laudantium
            labore nesciunt voluptatem tempore, facilis quasi sequi consequuntur
            fugit modi veniam perferendis ullam quas repellat? Quas dolore
            laboriosam accusantium reiciendis, vel voluptatibus minus.
            Necessitatibus dignissimos dolorem, consequuntur perspiciatis sed,
            error rem sunt at nisi rerum blanditiis expedita. Voluptate maiores
            odit quisquam natus magni veniam non in distinctio illum inventore
            ab voluptas, sequi alias, sed iusto! Cumque quis, fuga facilis odio
            impedit voluptate maiores earum praesentium temporibus quas expedita
            totam necessitatibus quibusdam quae soluta possimus dolore delectus
            amet voluptatum voluptates ea placeat! Quasi dignissimos consequatur
            culpa soluta? Hic cumque, velit ipsum, alias sequi aliquid minus
            adipisci facere ab, mollitia aspernatur distinctio. Animi, iure.
            Quae magnam excepturi numquam eveniet nam, perferendis aut facere
            maxime laboriosam asperiores laborum aperiam veritatis molestias
            ipsam? Et, vel. Aspernatur debitis ducimus provident quia iste nobis
            perspiciatis rerum alias doloremque animi laboriosam, harum libero
            reiciendis iusto delectus totam in laborum rem sequi minima modi
            velit error aut reprehenderit! Veritatis aperiam consectetur facere
            tenetur incidunt, pariatur expedita eaque odio architecto fuga alias
            deserunt reiciendis dolore ad ipsam dignissimos, esse exercitationem
            libero voluptatum at quos velit recusandae quod? Ratione velit
            magnam dolores animi atque natus pariatur, porro saepe amet dolore
            voluptate, quam eveniet, ut sunt assumenda quod ipsa eius dolor!
            Dolorem veniam vero eveniet. Eligendi quaerat ea ipsum non autem
            temporibus asperiores! Similique quis cum molestiae ipsam qui
            molestias eveniet quas minus voluptate officiis?
          </Text>
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
    fontSize: 16,
    fontWeight: "normal",
    color: "#F5F5F5",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-bold",
    textAlign: "center",
  },
})
