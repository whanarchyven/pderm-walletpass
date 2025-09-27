"use client";

import firebase from "firebase/app";
import "firebase/messaging";

if (!firebase.getApps().length) {
  const messaging = firebase.initializeApp({
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id",
  });
}
