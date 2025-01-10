# Workpay - Mobile app

This is Workpay Mobile app(ios/android) repo made with JS/TS and React Native + expo-modules

## Table of Contents

- [Workpay - Mobile app](#workpay---mobile-app)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
    - [iOS](#ios)
    - [Android](#android)
  - [Deploying the App](#deploying-the-app)
    - [Uploading builds](#uploading-builds)
      - [Android](#android-1)
      - [iOS](#ios-1)
    - [Codepushing](#codepushing)
  - [Dependencies](#dependencies)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Macbook machine to enable you run both android and ios, latest OS is recommended
- [Node.js](https://nodejs.org/) (latest LTS)
- [nvm](https://github.com/nvm-sh/nvm) (To enable you use different nodejs versions)
- [rbenv](https://github.com/rbenv/rbenv) (To manage ruby )
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- An Android or iOS device/emulator for testing
- [Xcode](https://developer.apple.com/xcode/) (for iOS development)
- [Android Studio](https://developer.android.com/studio) (for Android development)

## Installation

Ensure your machine is fully set up with the above before proceeding.

1. **Clone the repository in your preferred workspace folder**

   ```sh
    git clone https://gitlab.com/tozzaplus_systems/workpay-react-native-app-v3.git
   cd workpay-react-native-app-v3
   ```

2. **Install dependencies**
   ```sh
   yarn
   ```
   The above will install necessary js dependencies and pods for iOS

## Running the App

Start the metro server by running the below command

```sh
yarn start
```

### iOS

```sh
yarn ios
```

### Android

```sh
yarn android
```

## Deploying the App

Ensure your machine is fully set up with the above before proceeding. For more info on codepush, check on Workpay confluence.

- **Uploading builds to the stores `.aab` for `android` `.ipa` for `ios`** - This is done when there are major changes, eg new features or we have changes in native code ie `/ios` or `android` folders.

- **Codepushing** - This is used when we have minor changes eg. bug fixes. Please note this is done when we have only `js` changes

### Uploading builds

#### Android

We make builds for both `staging` for QA and `production` for the Playstore with normal below commands

- `yarn android-bundle-staging` - This will make a bundle for staging variant, this bundle is uploaded to [app-center](https://appcenter.ms/apps) for the QA team to test.

- `yarn android-bundle-production` - This will create a production bundle, this should uploaded to Playstore [playstore](https://play.google.com/console/u/0/developers)

#### iOS

For iOS we one have to use xcode to make builds. Please follow [this guide](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases) on how to distribute an application.

### Codepushing

Please note: This is recommended only when deploying minor changes.

- `yarn ota-update-production:ios` This will code push changes directly ios app installed by the users

- `yarn ota-update-production:android` This will code push changes directly android app installed by the users

## Dependencies

The following are the major dependencies used in this app:

- [@tanstack/react-query](https://www.npmjs.com/package/@tanstack/react-query) - Server state
- [React redux](https://www.npmjs.com/package/react-redux) - Global state
- [React navigation](https://reactnavigation.org/) - Navigation and routing
- [expo-sqlite](https://www.npmjs.com/package/expo-sqlite) - Local database
- [@tanstack/react-query](https://www.npmjs.com/package/@tanstack/react-query) - Server state
- Expo
- [Nativebase](https://nativebase.io/) - UI and styling
- [Date-fns](https://date-fns.org/) - Date utils
- Firebase - Notification and inApp messaging
- [Segment](https://www.npmjs.com/package/@segment/analytics-react-native) - Analytics tracking
- [react-native-svg](https://www.npmjs.com/package/react-native-svg) - For SVG images
