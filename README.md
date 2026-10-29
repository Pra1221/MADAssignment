 HabitHive : Build Better Days

HabitHive is a simple and interactive habit-tracking Android application designed to help users build positive routines, stay consistent, and monitor their daily progress. With a clean interface and a calming lavender theme, HabitHive makes developing better habits easier and more enjoyable.

 Features

Daily Habit Tracking: Add habits and mark them as completed each day.

Progress Dashboard: View daily completion progress at a glance.

Streak Tracking: Monitor consecutive days of habit completion and track your best streak.

Weekly History: Review your habit activity over the past seven days.

Habit Categories: Organize habits according to their purpose.

Custom Emojis: Personalize habits with emojis.

Dark Mode: Switch between light and dark themes.

Local Data Storage: Save habits and preferences on the device using browser local storage.

 Tech Stack

HTML5 — Application structure

CSS3 — Styling, responsive layout, and themes

JavaScript — Application logic and interactive features

Capacitor — Packaging the web application as an Android app

Android Studio — Android build and testing environment

 Run the Project Locally

Prerequisites

Node.js and npm

Android Studio and Android SDK (for Android builds)

Setup

Clone the repository:

git clone https://github.com/pra1221/MADAssignment.git

Navigate to the HabitHive project directory:

cd MADAssignment

Install dependencies:

npm install

Run the web application by opening www/index.html in a browser, or use VS Code Live Server.

Run on Android

Ensure Android Studio and the Android SDK are installed.

npx cap sync android
npx cap open android

In Android Studio, select an emulator or connected Android device and click Run.

APK Download

The prebuilt Android APK is available in this repository as HabitHive.apk.

Download the APK from the repository, transfer it to an Android device, and install it. You may need to allow installation from that source in your Android settings.

Project Structure

HabitHive/
├── android/                 # Native Android project
├── www/
│   ├── index.html            # Application interface
│   ├── style.css             # Styling and themes
│   └── script.js             # Habit tracking logic
├── .gitignore
├── capacitor.config.json
├── package.json
├── package-lock.json
└── HabitHive.apk             # Android application package

Objective

The objective of HabitHive is to encourage consistency and personal growth by providing a convenient way to organize daily habits, track progress, and build better routines.

Author

Prachi

GitHub: @pra1221

HabitHive : Small habits. Better days. Brighter futures. 💜
