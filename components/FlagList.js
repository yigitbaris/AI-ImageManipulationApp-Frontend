import { useState } from "react"
import {
  StyleSheet,
  FlatList,
  Image,
  Platform,
  Pressable,
  Text,
} from "react-native"

export default function FlagList({ onSelect, onCloseModal }) {
  const [flags] = useState([
    {
      id: 0,
      img: require("@/assets/images/turkishFlag.webp"),
      title: "Türkçe",
      code: "tr",
    },
    {
      id: 1,
      img: require("@/assets/images/engFlag.jpg"),
      title: "English",
      code: "eng",
    },
    {
      id: 2,
      img: require("@/assets/images/germanFlag.jpg"),
      title: "Deutsch",
      code: "german",
    },
    {
      id: 3,
      img: require("@/assets/images/russianFlag.jpg"),
      title: "Русский",
      code: "russian",
    },
  ])

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={Platform.OS === "web"}
      data={flags}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item, index }) => {
        return (
          <Pressable
            onPress={() => {
              onSelect(item)
              onCloseModal()
            }}
            style={{ alignItems: "center", marginRight: 20 }}
          >
            <Image
              source={item.img}
              key={index}
              style={styles.image}
              resizeMode="cover"
            />
            <Text
              style={{
                color: "white",
                marginTop: 10,
                fontFamily: "NunitoSans-Bold",
              }}
            >
              {item.title}
            </Text>
          </Pressable>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  listContainer: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: 100,
    height: 80,
    borderRadius: 20,
  },
})
