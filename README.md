# weather-app
This app will display the current weather based on your location

Please make sure that Android Studio is already setup in your machine together with the virtual devices. For this app, it is 
best to test on an actual device. 

Android Setup
https://ionicframework.com/docs/developing/android (Follow the steps until Cordova Setup)

iOS Setup
https://ionicframework.com/docs/developing/ios (Follow the steps until Cordova Setup)

# Project Setup
1. Perform git clone to download the project in your local machine by executing this command in your terminal if you're using mac or cmd for windows

git clone https://github.com/alcantaramark/weather-app.git

2. Open termina or cmd on the folder where the project was cloned and execute the command below

npm-install

3. Add android platform by executing the command below. For some reasons, I'm having plugin issues when I used the latest version which is 10.0.0. Let's use 9.0.0 instead.

ionic cordova platform add android@9.0.0

4. We're going to do the same for ios by executing this command.

ionic cordova platform add ios@latest

5. Setup android project using the command below

ionic cordova prepare android

6. Setup ios project using the command below

ionic cordova prepare ios

# Running the App - Android
1. Open your android studio and navigate to /platforms/android
2. The studio will download the necessary gradle versions and will setup up the project for you
3. Attached a device
4. Hit the run button

# Running the App - iOS
1. Open the file platforms/ios/Weather App.xcworkspace
2. Xcode will open your project
3. Select the project under TARGETS
4. Signing and Capabilities tab, under Signing(Debug) select Team
5. The team that you're going to select should be the name of the account that is loggein with the words (Personal Team)
6. Xcode will let your signin your developer account
7. Attached a device and press run




