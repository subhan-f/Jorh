import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { getApp } from "./app.js";

let _storage: ReturnType<typeof getStorage> | null = null;

export function getStorageInstance() {
  if (!_storage) _storage = getStorage(getApp());
  return _storage;
}

export async function uploadFile(path: string, file: File | Blob): Promise<string> {
  const storageRef = ref(getStorageInstance(), path);
  const snap = await uploadBytes(storageRef, file);
  return getDownloadURL(snap.ref);
}

export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(getStorageInstance(), path);
  await deleteObject(storageRef);
}

export { ref, getDownloadURL };
