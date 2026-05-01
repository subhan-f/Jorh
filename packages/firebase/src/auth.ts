import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as _signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  type User,
} from "firebase/auth";
import { getApp } from "./app.js";

export const auth = getAuth(getApp());
const googleProvider = new GoogleAuthProvider();

export const signInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const signUpWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export const signOut = () => _signOut(auth);

export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

export const updateUserProfile = (user: User, profile: { displayName?: string; photoURL?: string }) =>
  updateProfile(user, profile);

export const onAuthChange = (cb: (user: User | null) => void) => onAuthStateChanged(auth, cb);

export const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
};

export type { User };
