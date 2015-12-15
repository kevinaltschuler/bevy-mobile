# bevy-mobile #

SO NASTY THAT ITS PROBABLY SOMEWHAT OF A TRAVESTY

bevy for iphone and android, using <a href='https://facebook.github.io/react-native/'>React Native</a>

# IOS Installation #

### Requirements ###
1. OS X - This repo only contains the iOS (7+) implementation right now, and Xcode only runs on Mac.
2. <a href='https://developer.apple.com/xcode/downloads/'>Xcode</a> 6.3 or higher is recommended.
3. <a href='http://brew.sh/'>Homebrew</a> is the recommended way to install node, watchman, and flow.
4. ```brew install node.``` New to <a href='https://nodejs.org/'>node</a> or <a href='https://docs.npmjs.com/'>npm</a>?
5. ```brew install watchman.``` We recommend installing <a href='https://facebook.github.io/watchman/docs/install.html'>watchman</a>, otherwise you might hit a node file watching bug.
6. ```brew install flow.``` If you want to use <a href='http://www.flowtype.org/'>flow</a>.

### Setup ###
1. ```git clone git@github.com:kevtastic/bevy-mobile.git```
3. in the shell, naviagte to (your git folder)/bevy-mobile/
4. ```npm install```
5. open xcode
7. In XCode, in the project navigator right click `Libraries` ➜ `Add Files to [your project's name]`
8. Go to `node_modules` ➜ `react-native-icons`➜ `ios` and add `ReactNativeIcons.xcodeproj` 
9. Add `libReactNativeIcons.a` (from 'Products' under ReactNativeIcons.xcodeproj) to your project's `Build Phases` ➜ `Link Binary With Libraries` phase
11. Run the project (`Cmd+R`)

# Android Installation #

### Requirements ###
1. Download <a href='https://developer.android.com/sdk/index.html'>Android Studio</a>
  * Android Studio isn't completely necessary, we just need the android sdk. download it separately if you want to
2. Download the <a href='http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html'>Java JDK</a>
3. Download node.js (^v4.0.0)
  1. Mac OSX: ```brew install node.```
  2. Windows: <a href='https://github.com/marcelklehr/nodist'>nodist</a>
  3. Linux: <a href='https://github.com/creationix/nvm'>nvm</a>
4. If not using an emulator, enable developer mode on your device (go to settings and tap version 7 times)
5. Add android-sdk/tools to path so we can use adb commands
6. Run ```android sdk```
  * Download the latest API version (SDK platform and Google APIs Intel x86_64 image are the only ones we need)
  * Also Install (in Extras) Android Support Repository, Android Support Library, Google Repository, all the Google Play stuff, and Intel HAXM (need to run a separate installer)
7. Install Genymotion [here](https://www.genymotion.com/#!/) - we're not using the default emulator
  * You need to create an account. Just use the free version for now
  * Im currently using a virtual Nexus 5 w/ API 22
8. Flash Genymotion with ARM translation and the Google APIs. Instructions [here](http://inthecheesefactory.com/blog/how-to-install-google-services-on-genymotion/en)
  * This allows us to use Google Login, and maybe some other neat stuff in the future. Right now the default emulators have crappy support for Google APIs and are usually outdated

### Setup ###
1. ```git clone git@github.com:kevtastic/bevy-mobile.git```
2. ```npm install```
3. ```npm install -g react-native-cli```
4. Add the ANDROID_HOME path variable
  1. Linux: ```export ANDROID_HOME="/home/[user]/Android/Sdk"```
  2. Windows: path is probably at C:\Users\[user]\.android\sdk
5. in a separate terminal - ```npm start``` or ```react-native start```
6. ```react-native run-android```
  * This will build the app, install it, and run it on your virtual/physical device
  
### Deployment ###
1. In the root of the project, run ```./android-bundle.js```
  * This bundles and optimizes all the js into the index.android.bundle js file.
  * If you can't execute the script, then run ```chmod +x ./android-bundle.sh``` to flip the executable flag
2. ```cd android```
3. ```./gradlew assembleRelease``` will give you a production APK (located in android/app/build/outputs/apk/app-release.apk)
4. IMPORTANT!! Test the release build on an emulator/physical device first with ```./gradlew installRelease``` DONT PUSH A BROKEN BUILD
5. Once you're sure it works, upload the app-release.apk to the Google Play Store

