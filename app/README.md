# GOU PA NOU - Dynamic E-Commerce System

This project is a React-based e-commerce application with a full Admin Dashboard for inventory management, powered by Firebase.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- A Firebase project (Spark or Blaze plan)

### 2. Firebase Setup
1. Create a new project at [Firebase Console](https://console.firebase.google.com).
2. Enable **Authentication** (Email/Password provider).
3. Enable **Cloud Firestore** (start in Test Mode for development).
4. Go to **Project Settings** > **General** > **Your apps** > **Add app** (Web).
5. Copy the configuration object (apiKey, authDomain, etc.).

### 3. Environment Config
Create a `.env` file in the `app` directory with the following (fill in your values):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run the Application
```bash
cd app
npm install
npm run dev
```
Open `http://localhost:5173` to view the site.

## 🔐 Admin Access
1. Navigate to `http://localhost:5173/admin/login`.
2. Initial Setup:
   - Create a user in Firebase Console -> Authentication -> Users.
3. Login with those credentials to access the Dashboard.

## 🛠 Features
- **Shop**: Browse spices and local food (fetched from Firestore).
- **Admin**:
  - Manage Products (Add, Edit, Delete, Toggle Stock - Syncs with Firestore).
  - Manage Orders (Coming Soon).
  - Manage Promotions (Coming Soon).
