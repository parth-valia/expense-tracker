# Expense Tracker 📱💸

A fluid, single-purpose mobile application for tracking daily expenses, built with **React Native**, **Expo**, and **TypeScript**. 

## ✨ Features

- **Fluid Navigation:** Seamless routing between the Dashboard and Add Expense screens using React Navigation with native transitions.
- **Persistent State:** Uses Redux Toolkit and `redux-persist` (backed by AsyncStorage) to ensure your expense data survives app closures.
- **Native Feel:** 
  - Respects safe areas across different devices.
  - Utilizes native input modes (e.g., decimal keypad for amounts).
  - Smooth micro-animations for interactions (header springs, stagger list reveals, FAB interactions).
- **Premium Dark Aesthetics:** A carefully curated dark-mode color palette with cyan and coral accents.
- **Form Validation:** Ensures all expense entries have a valid title, category, and amount before submission.

## 🛠 Tech Stack

- **Framework:** React Native / Expo (SDK 55)
- **Language:** TypeScript
- **State Management:** Redux Toolkit + React Redux
- **Persistence:** Redux Persist + React Native AsyncStorage
- **Navigation:** React Navigation (Native Stack)
- **Styling:** React Native StyleSheet API + Expo Vector Icons

## 🚀 Getting Started

### Prerequisites

You need to have [Node.js](https://nodejs.org/) installed on your machine.
You will also need the **Expo Go** app installed on your iOS or Android device.

### Installation

1. Clone the repository or download the source code.
2. Navigate to the project directory:
   ```bash
   cd expense-tracker
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the Expo development server:

```bash
npx expo start -c
```
*(The `-c` flag clears the cache to ensure all native modules like AsyncStorage load correctly).*

Once the server is running, a QR code will appear in your terminal. 
- Open the **Expo Go** app on your phone.
- **iOS:** Use your phone's Camera app to scan the QR code and tap the Expo Go prompt.
- **Android:** Use the "Scan QR Code" feature inside the Expo Go app itself.

## 📂 Project Structure

```text
expense-tracker/
├── App.tsx                           # App entry point (Providers & Navigation)
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx          # Stack Navigator configuration
│   ├── screens/
│   │   ├── DashboardScreen.tsx       # Expense list, total stats, FAB
│   │   └── AddExpenseScreen.tsx      # Form for adding new expenses
│   ├── store/
│   │   ├── index.ts                  # Redux store & persistor configuration
│   │   └── slices/
│   │       └── expenseSlice.ts       # Expense reducers (add, delete)
│   ├── theme/
│   │   └── colors.ts                 # Centralized dark-mode color palette
│   └── types/
│       └── expense.ts                # TypeScript interfaces and constants
```
