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
2. Download the <a href='http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html'>Java JDK</a>
3. Download node.js (^v4.0.0)
  1. Mac OSX: ```brew install node.```
  2. Windows: <a href='https://github.com/marcelklehr/nodist'>nodist</a>
  3. Linux: <a href='https://github.com/creationix/nvm'>nvm</a>
4. If not using an emulator, enable developer mode on your device

### Setup ###
1. ```git clone git@github.com:kevtastic/bevy-mobile.git```
2. ```npm install```
3. ```npm install -g react-native-cli```
4. Add the ANDROID_HOME path variable
  1. Linux: ```export ANDROID_HOME="/home/[user]/Android/Sdk"```
  2. Windows: path is probably at C:\Users\[user]\.android\sdk
5. ```react-native run-android```
6. in a separate terminal - ```npm start```
