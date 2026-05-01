import { initializeApp, getApps, type FirebaseApp } from "firebase/app";

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

let _app: FirebaseApp | null = null;

export function initFirebase(config: FirebaseClientConfig): FirebaseApp {
  if (_app) return _app;
  _app = getApps().length === 0 ? initializeApp(config) : getApps()[0]!;
  return _app;
}

export function getApp(): FirebaseApp {
  if (!_app) {
    if (getApps().length > 0) {
      _app = getApps()[0]!;
      return _app;
    }
    throw new Error("Firebase app not initialized. Call initFirebase() first.");
  }
  return _app;
}
