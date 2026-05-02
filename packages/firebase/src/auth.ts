import {
  initializeAuth,
  getAuth,
  browserPopupRedirectResolver,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  inMemoryPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut as _signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  type Auth,
  type User,
} from "firebase/auth";
import { getApp } from "./app.js";

let _auth: Auth | null = null;

function auth(): Auth {
  if (_auth) return _auth;
  try {
    // Do NOT pass popupRedirectResolver here. Passing it to initializeAuth causes
    // the resolver to eagerly call _initialize() on startup, which writes to
    // sessionStorage and triggers "Unable to save initial state" in every page load
    // (even before the user attempts sign-in). Instead we pass it lazily, directly
    // to signInWithPopup, so sessionStorage is only touched when explicitly needed.
    _auth = initializeAuth(getApp(), {
      persistence: [indexedDBLocalPersistence, browserLocalPersistence, inMemoryPersistence],
    });
  } catch {
    // Already initialized (e.g. Vite HMR) — grab the existing instance
    _auth = getAuth(getApp());
  }
  return _auth;
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const signInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth(), email, password);

export const signUpWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth(), email, password);

// Pass browserPopupRedirectResolver explicitly so initializeAuth stays clean.
export const signInWithGoogle = async () => {
  try {
    return await signInWithPopup(auth(), googleProvider, browserPopupRedirectResolver);
  } catch (error) {
    const code = (error as { code?: string }).code ?? "";
    if (
      code === "auth/popup-blocked" ||
      code === "auth/operation-not-supported-in-this-environment"
    ) {
      await signInWithRedirect(auth(), googleProvider, browserPopupRedirectResolver);
      return null;
    }
    throw error;
  }
};

export const signOut = () => _signOut(auth());

export const resetPassword = (email: string) => sendPasswordResetEmail(auth(), email);

export const updateUserProfile = (
  user: User,
  profile: { displayName?: string; photoURL?: string }
) => updateProfile(user, profile);

export const onAuthChange = (cb: (user: User | null) => void) => onAuthStateChanged(auth(), cb);

export const getIdToken = async (forceRefresh = false): Promise<string | null> => {
  const user = auth().currentUser;
  if (!user) return null;
  return user.getIdToken(forceRefresh);
};

export type { User };
