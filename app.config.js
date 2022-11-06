export default () => ({
  expo: {
    name: "StayFocusExpo",
    slug: "stayfocusexpo",
    owner: "trung.hai",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    plugins: [
      "@notifee/react-native",
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 33,
            targetSdkVersion: 33,
          },
          ios: {
            deploymentTarget: "13.0",
          },
        },
      ],
    ],
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
      package: "com.trung.hai.stayfocusexpo",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      FIREBASE_APIKEY: process.env.FIREBASE_APIKEY || null,
      eas: {
        projectId: "c2550d6d-a233-40b8-a2fa-5b000fd8e56a",
      },
    },
  },
});
