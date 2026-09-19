# Bacon Vision iOS App

## How to submit to the App Store without a Mac

### Step 1 — Create accounts (free)
- **GitHub:** github.com — create an account
- **Expo:** expo.dev — create an account

### Step 2 — Get your Expo token
- Go to expo.dev → Account → Access Tokens
- Create a new token → copy it

### Step 3 — Create a GitHub repo
- Go to github.com → New repository → name it "bacon-vision-app"
- Upload all these files to the repo

### Step 4 — Add secrets to GitHub
- Go to your repo → Settings → Secrets and variables → Actions
- Add secret: `EXPO_TOKEN` = your Expo token from Step 2
- Add secret: `APPLE_APP_SPECIFIC_PASSWORD` = generate at appleid.apple.com → App-Specific Passwords

### Step 5 — Fill in your details in eas.json
- Replace `YOUR_APPLE_ID_EMAIL` with your Apple ID email
- Replace `YOUR_APPLE_TEAM_ID` with your team ID (found at developer.apple.com → Membership)
- Replace `YOUR_EAS_PROJECT_ID` with the ID from expo.dev after linking

### Step 6 — Add your icon files to /assets
- `icon.png` — 1024x1024 PNG, your Bacon Vision logo
- `splash.png` — 1284x2778 PNG, splash screen
- `adaptive-icon.png` — 1024x1024 PNG for Android

### Step 7 — Push to GitHub
- Commit and push to main branch
- GitHub Actions automatically builds and submits to App Store

### Step 8 — App Store Connect
- Go to appstoreconnect.apple.com
- Create a new app record
- Fill in name, description, screenshots
- Submit for review
