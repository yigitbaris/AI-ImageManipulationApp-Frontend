import React, { useEffect, useRef } from "react"
import { AppState, AppStateStatus } from "react-native"
import { AppOpenAd, TestIds, AdEventType } from "react-native-google-mobile-ads"

const APP_OPEN_AD_UNIT_ID = __DEV__
  ? TestIds.APP_OPEN
  : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy"

export default function AppOpenAdManager() {
  // 1) Create a ref to hold the AppOpenAd instance
  const appOpenAdRef = useRef(
    AppOpenAd.createForAdRequest(APP_OPEN_AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    })
  )

  // 2) Keep track of AppState so we can show ad when app becomes active
  const appState = useRef<AppStateStatus>(AppState.currentState)

  useEffect(() => {
    // 3) Add listener for AppState changes
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    )

    // 4) Load the first ad right away
    loadAppOpenAd()

    return () => {
      subscription.remove()
    }
  }, [])

  const loadAppOpenAd = () => {
    const ad = appOpenAdRef.current
    ad.load()

    // Optional: Listen for load success or error
    const unsubscribe = ad.addAdEventListener(AdEventType.LOADED, () => {
      console.log("✅ App Open ad loaded")
      unsubscribe()
    })
    const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, (err) => {
      console.warn("❌ App Open ad failed to load:", err)
      unsubscribeError()
    })
  }

  const handleAppStateChange = (newState: AppStateStatus) => {
    // If the app just moved from background/inactive into active
    if (
      appState.current.match(/inactive|background/) &&
      newState === "active"
    ) {
      const ad = appOpenAdRef.current
      if (ad.loaded) {
        // 5) Show the ad
        ad.show().catch((err) => console.warn("Failed to show AppOpenAd:", err))
      } else {
        // If it’s not loaded yet, kick off another load
        loadAppOpenAd()
      }
    }
    appState.current = newState
  }

  return null // This component doesn’t render anything UI‐wise
}
