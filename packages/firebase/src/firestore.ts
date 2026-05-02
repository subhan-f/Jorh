import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment,
  type QueryConstraint,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { getApp } from "./app.js";

let _db: ReturnType<typeof getFirestore> | null = null;

export function getDb() {
  if (!_db) _db = getFirestore(getApp());
  return _db;
}

export const Collections = {
  USERS: "users",
  LINKS: "links",
  CLICKS: "clicks",
  BIO_PAGES: "bioPages",
  WORKSPACES: "workspaces",
  QR_CODES: "qrCodes",
  INVITES: "invites",
  AUDIT_LOGS: "auditLogs",
} as const;

export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment,
};

export type { QueryConstraint, DocumentData, QueryDocumentSnapshot };

export function docToData<T>(snap: QueryDocumentSnapshot<DocumentData>): T & { id: string } {
  return { id: snap.id, ...snap.data() } as T & { id: string };
}
