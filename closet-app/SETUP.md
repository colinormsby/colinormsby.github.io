# Closet App — Setup Guide

A mobile app to photograph clothes, remove backgrounds, and build outfits.

---

## Prerequisites

Install these once if you don't have them:

- **Node.js 18+** — https://nodejs.org
- **Expo Go** app on your phone (iOS App Store or Google Play)

---

## 1. Clone the repo

```bash
git clone https://github.com/colinormsby/colinormsby.github.io.git
cd colinormsby.github.io
git checkout claude/install-designer-builder-skills-CV7eJ
cd closet-app
```

## 2. Install dependencies

```bash
npm install
```

## 3. Add your API key

Create a file called `.env.local` in the `closet-app/` folder:

```bash
echo "EXPO_PUBLIC_REMOVEBG_API_KEY=5ehrma55VaAqsjvZFvxgiRod" > .env.local
```

This enables automatic background removal via [remove.bg](https://www.remove.bg/).
Free tier = 50 photos/month. The app still works without it (keeps original photo).

## 4. Start the app

```bash
npx expo start
```

Then:
- **Phone**: Scan the QR code with the **Expo Go** app
- **iOS Simulator**: Press `i` (requires Xcode on Mac)
- **Android Emulator**: Press `a` (requires Android Studio)

---

## How to use

| Screen | How to get there |
|--------|-----------------|
| **Closet** | Home tab — your clothing grid |
| **Add item** | Tap **+** on the Closet tab |
| **Outfits** | Outfits tab — saved outfit collections |
| **Build outfit** | Tap **+** on the Outfits tab |

### Adding a clothing item
1. Tap **+** → choose **Camera** or **Gallery**
2. Take/pick a photo — background is removed automatically
3. Fill in name, category, color, brand, tags
4. Tap **Save to Closet**

### Building an outfit
1. Go to **Outfits** tab → tap **+**
2. Tap items to select them (filtered by category)
3. Give the outfit a name → tap **Save**

---

## Project structure

```
closet-app/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx        # Closet screen
│   │   └── outfits.tsx      # Outfits screen
│   ├── add-item.tsx         # Add clothing modal
│   └── item/[id].tsx        # Item detail screen
├── components/
│   ├── ClothingCard.tsx
│   ├── CategoryPill.tsx
│   ├── OutfitCard.tsx
│   └── OutfitBuilderModal.tsx
├── lib/
│   ├── backgroundRemoval.ts # remove.bg API integration
│   ├── database.ts          # SQLite persistence
│   └── utils.ts             # Helpers, category list
├── store/
│   └── closetStore.ts       # Zustand global state
└── types/
    └── index.ts             # TypeScript types
```

## Tech stack

| | |
|-|-|
| Framework | Expo SDK 54 + expo-router |
| Language | TypeScript |
| Styling | NativeWind (Tailwind CSS) |
| State | Zustand |
| Database | expo-sqlite (local, on-device) |
| Background removal | remove.bg API |
