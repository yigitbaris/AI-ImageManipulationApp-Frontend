import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import { readData, storeData } from "../utils/localStorage"
import * as Localization from "expo-localization"

interface GlobalContextType {
  myLang: string
  setMyLang: (lang: string) => void
  imageGenerationCount: number
  incrementGenerationCount: () => void
}

interface GlobalProviderProps {
  children: ReactNode
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext)
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider")
  }
  return context
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [myLang, setMyLang] = useState<string>("eng")
  const [imageGenerationCount, setImageGenerationCount] = useState<number>(0)

  // Mevcut localStorage'daki dili oku, yoksa cihazdan al
  const initLanguage = async () => {
    try {
      const savedLang = await readData("lang")
      if (savedLang) {
        setMyLang(savedLang)
      } else {
        // Expo-Localization'dan ilk tercihli dili al
        const deviceLang = Localization.getLocales()?.[0]?.languageCode || "en"
        // Türkçe ise "tr", diğer durumlarda "eng" olarak ata
        const appLang = deviceLang.startsWith("tr") ? "tr" : "eng"
        setMyLang(appLang)
        // kullanıcının seçimini kaydet (sonraki açılışta burayı atlarız)
        await storeData("lang", appLang)
      }
    } catch (error) {
      console.error("Error initializing language:", error)
      setMyLang("eng") // fallback
    }
  }

  // Initialize generation count from localStorage
  const initGenerationCount = async () => {
    try {
      const savedCount = await readData("imageGenerationCount")
      if (savedCount && typeof savedCount === "number") {
        setImageGenerationCount(savedCount)
      }
    } catch (error) {
      console.error("Error initializing generation count:", error)
      setImageGenerationCount(0) // fallback
    }
  }

  // Function to increment generation count
  const incrementGenerationCount = async () => {
    const newCount = imageGenerationCount + 1
    setImageGenerationCount(newCount)
    try {
      await storeData("imageGenerationCount", newCount)
    } catch (error) {
      console.error("Error saving generation count:", error)
    }
  }

  useEffect(() => {
    initLanguage()
    initGenerationCount()
  }, [])

  const value: GlobalContextType = {
    myLang,
    setMyLang,
    imageGenerationCount,
    incrementGenerationCount,
  }

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  )
}

export default GlobalProvider
