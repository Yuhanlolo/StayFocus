# StayFocus

StayFocus app, built with [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/).

## Running the app

### Requirements

You can follow the guide from Expo [here](https://docs.expo.dev/get-started/installation/). In short, you need:

- NodeJS and npm on your computer.
- An Android or iOS device with the [Expo Go](https://docs.expo.dev/get-started/installation/#2-expo-go-app-for-ios-and) app installed.
- (Optional) [Tailscale](https://tailscale.com/kb/1017/install/) on your computer and phone.

### Instructions

Clone the repo, then inside the top level folder, run

```
npm install
npx expo start
```

Expo will show a QR code. Scan it with your phone to get the app running.

For more information, see the [Expo guide](https://docs.expo.dev/get-started/create-a-new-app/#starting-the-development-server)

### Troubleshooting

If your computer and phone are on different networks and Expo Go cannot connect, try running `npx expo start --tunnel` instead. Alternatively, if both machines are in a Tailscale network, you can use the Tailscale IP address for the Expo URL.

If you want to run an emulator or simulator on the computer directly, follow the [Expo guide](https://docs.expo.dev/get-started/installation/#2-expo-go-app-for-ios-and).

## Structure

- `App.js`: the entry point of the app
- `src`:
  - `components`: reusable components for the app
  - `helpers`: utilities for styling and other thing
    - `ThemeContext.js`: global styles and design tokens
  - `screens`: pages in the app
