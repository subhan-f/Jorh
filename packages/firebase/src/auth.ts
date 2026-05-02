import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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
  _auth = getAuth(getApp());
  return _auth;
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const signInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth(), email, password);

export const signUpWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth(), email, password);

export const signInWithGoogle = async () => {
  // Redirect flow is more robust in browsers that restrict popup storage.
  // Use the default redirect resolver to avoid resolver-specific storage quirks.
  await signInWithRedirect(auth(), googleProvider);
  return null;
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
