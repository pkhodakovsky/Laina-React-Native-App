
## To Run the application on Android

1. You will need Node, Watchman, the React Native command line interface, a JDK, and Android Studio.

> brew install node
> brew install watchman

- If you have already installed Node on your system, make sure it is Node 12 or newer.

2. ### Install JDK using Homebrew
> brew install --cask adoptopenjdk/openjdk/adoptopenjdk11

3. ### Install Android Studio
[Download Android Studio](https://developer.android.com/studio/index.html),  While on Android Studio installation wizard, make sure the boxes next to all of the following items are checked:

- Android SDK
- Android SDK Platform
- Android Virtual Device

4. ### Install the Android SDK:
![MarineGEO circle logo](https://reactnative.dev/assets/images/GettingStartedAndroidStudioWelcomeMacOS-cbb28b4b70c4158c1afd02ddb6b12f4a.png "MarineGEO logo")

Select the "SDK Platforms" tab from within the SDK Manager, then check the box next to "Show Package Details" in the bottom right corner. Look for and expand the Android 10 (Q) entry, then make sure the following items are checked:

- Android SDK Platform 29
- Intel x86 Atom_64 System Image or Google APIs Intel x86 Atom System Image
Finally, click "Apply"

5. ### Adding ENV Variables:
Run the following command:
> open ~/.bash_profile

This will open a text file.
Add the following lines to your bash_profile or the opened text file in the above step.
```javascript
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```
Save the text file and close it.

6. ### Setup the codebase
Open a terminal on the folder in which you want the code to be saved and enter the following commands (Make sure you have GIT installed)
```bash
git clone https://gitlab.protovate.com/lainaedge/laina-react-native-app.git
```
```bash
cd laina-react-native-app
```
```bash
npm --legacy-peer-deps install
```
Wait for the installation to get completed. After that run the following commands.

```bash
npx react-native run-android
```

> :warning: **If you cant get this to work, try [troubleshooting  here](https://reactnative.dev/docs/troubleshooting)**.

## Create An Android Release and Debug builds.
If you doing it for the first time follow the steps 1 to 6 in **To Run the application on Android** section. Then follow the below steps.

1. ### Getting android release build
Open the terminal on the folder where the LAINA app codebase is located. And run the following commands.
#### Windows
```bash
cd android && gradlew assembleRelease
```
#### MAC OSX
```bash
cd android && ./gradlew assembleRelease
```

As a result, the APK creation process is done. You can find the generated APK at android/app/build/outputs/apk/app-release.apk. 

2. ### Getting android debug build
Open the terminal on the folder where the LAINA app codebase is located. And run the following commands.
#### Windows
```bash
cd android && gradlew assembleDebug
```
#### MAC OSX
```bash
cd android && ./gradlew assembleDebug
```

## To Run the application on MAC OS:
1. If you doing it for the first time follow the steps 1 and 2 in **To Run the application on Android** section.

2. After clonning the repo open terminal in your project directory and run `npm install` or `yarn`

3. Install and download XCode if not already installed. The easiest way is to download it from app store or you can also the following command `xcode-select — install`

4. Than navigate to your ios directory and run `pod install`

5. After that you can navigate back to your root directory and run `npx react-native run-ios`

## To Get the IOS Release build:

1. In order to get the IOS release build follow the steps below.
```bash
npx react-native run-ios --configuration=release
```
2. Find the file at `.app` file path `Build/Products/Release/"<Your_Filename>.app"`.

3. Convert `.app` to `.ipa` :

4. Create folder Payload.
paste .app file into Payload folder.
compress the Payload folder.
change the name you want and put extension as .ipa.

## To Upload the app on Deploye Gate and create APK and Zip file follow the steps given below:

4. If you are doing it first time with your machine follow step #2 and #3 else start from step #4.

5. First download and intall [ruby](#https://rubyinstaller.org/downloads/)
Verify the installation of ruby (on CMD run `ruby --version`)

6. Than open CMD and install bundler with `gem install bundler`

7. Than open your project directory on VS code terminal write `bundle init` OR `bundler init` *TRY THE FIRST OPTION FIRST*

8. After the #4 option you should have a file named **Gemfile**, replace all its content with this: 
```rb
# frozen_string_literal: true
source "https://rubygems.org"
gem "fastlane"
```

6. Now run bundler update on the terminal (You will install fastlane by doing it). 
    you should now have another file in your root "Gemfile.lock".

Now you can clean built, create apk with zip file with just one script.

> `npm run android_apk_zip`

or

> `yarn android_apk_zip`

---

## To Upload the app on testFlight and create IPA file follow the steps below.

1. First open the project folder in Xcode.

2. Click on the project name, in the options section click sign in credentials.

3. Now, here you have to add a team, click add team button it will ask you for the apple ID

4. After successfully adding a team to the project, make sure you also add sign in cirtificates, field to add that is just below the add team field, also check that app icons are added by opening images.* file. You should see images, if not add an image for the app icon.

5. After doing that, open the project directory in VS code.

6. In VS code open terminal and navigate to the ios directory and run `fastname ios beta`

7. Now, let it do the work for you, it may ask you for the apple store connect account, you will have to feed it with your email and password for the first time.

8. After all the waiting you can see the app uploaded to testFlight account.

you are good to go.

