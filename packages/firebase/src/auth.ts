import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as _signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  type AuthError,
  type Auth,
  type UserCredential,
  type User,
} from "firebase/auth";
import { getApp } from "./app.js";

let _auth: Auth | null = null;

function auth(): Auth {
  if (_auth) return _auth;
  _auth = getAuth(getApp());
  return _auth;
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const signInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth(), email, password);

export const signUpWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth(), email, password);

function shouldFallbackToRedirect(error: unknown): boolean {
  const authError = error as Partial<AuthError> & { message?: string };
  const code = authError.code ?? "";

  if (code === "auth/popup-blocked") return true;
  if (code === "auth/cancelled-popup-request") return true;
  return false;
}

export const signInWithGoogle = async (): Promise<UserCredential | null> => {
  try {
    return await signInWithPopup(auth(), googleProvider);
  } catch (error) {
    if (!shouldFallbackToRedirect(error)) throw error;
    await signInWithRedirect(auth(), googleProvider);
    return null;
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
