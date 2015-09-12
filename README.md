# Bevy-xcode #

SO NASTY THAT ITS PROBABLY SOMEWHAT OF A TRAVESTY

bevy for iphone, using <a href='https://facebook.github.io/react-native/'>React Native</a>

# Installation #

### Requirements ###
1. OS X - This repo only contains the iOS (7+) implementation right now, and Xcode only runs on Mac.
2. <a href='https://developer.apple.com/xcode/downloads/'>Xcode</a> 6.3 or higher is recommended.
3. <a href='http://brew.sh/'>Homebrew</a> is the recommended way to install node, watchman, and flow.
4. ```brew install node.``` New to <a href='https://nodejs.org/'>node</a> or <a href='https://docs.npmjs.com/'>npm</a>?
5. ```brew install watchman.``` We recommend installing <a href='https://facebook.github.io/watchman/docs/install.html'>watchman</a>, otherwise you might hit a node file watching bug.
6. ```brew install flow.``` If you want to use <a href='http://www.flowtype.org/'>flow</a>.

### Setup ###
1. ```git clone git@github.com:kevtastic/Bevy-xcode.git```
3. in the shell, naviagte to (your git folder)/bevy-xcode/
4. ```npm install```
5. open xcode
7. In XCode, in the project navigator right click `Libraries` ➜ `Add Files to [your project's name]`
8. Go to `node_modules` ➜ `react-native-icons`➜ `ios` and add `ReactNativeIcons.xcodeproj` 
9. Add `libReactNativeIcons.a` (from 'Products' under ReactNativeIcons.xcodeproj) to your project's `Build Phases` ➜ `Link Binary With Libraries` phase
11. Run the project (`Cmd+R`)
