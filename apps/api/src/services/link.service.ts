import { adminDb, Collections } from "../lib/firebase.js";
import { kvSet, kvDelete } from "../lib/kv.js";
import { generateShortCode } from "@jorh/utils";
import type { CreateLinkInput, UpdateLinkInput, Link } from "@jorh/types";
import { FieldValue } from "firebase-admin/firestore";

export async function createLink(ownerId: string, input: CreateLinkInput): Promise<Link> {
  const shortCode = input.customSlug ?? generateShortCode();

  const existing = await adminDb
    .collection(Collections.LINKS)
    .where("shortCode", "==", shortCode)
    .where("isDeleted", "==", false)
    .limit(1)
    .get();

  if (!existing.empty) {
    throw Object.assign(new Error("Short code already taken"), { status: 409 });
  }

  const now = new Date();
  const link: Omit<Link, "id"> = {
    ownerId,
    originalUrl: input.originalUrl,
    shortCode,
    customSlug: input.customSlug,
    title: input.title,
    tags: input.tags ?? [],
    type: input.type ?? "short",
    password: input.password,
    expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
    clickLimit: input.clickLimit,
    clickCount: 0,
    isActive: true,
    isDeleted: false,
    domain: "jorh.net",
    createdAt: now,
    updatedAt: now,
  };

  const ref = adminDb.collection(Collections.LINKS).doc();
  await ref.set(link);

  await kvSet(shortCode, {
    id: ref.id,
    originalUrl: link.originalUrl,
    isActive: true,
    expiresAt: link.expiresAt?.getTime(),
    clickLimit: link.clickLimit,
    clickCount: 0,
    password: link.password,
  });

  return { id: ref.id, ...link };
}

export async function getUserLinks(
  ownerId: string,
  opts: { limit?: number; cursor?: string; type?: string } = {}
): Promise<{ links: Link[]; hasMore: boolean }> {
  const pageSize = opts.limit ?? 20;
  let q = adminDb
    .collection(Collections.LINKS)
    .where("ownerId", "==", ownerId)
    .where("isDeleted", "==", false)
    .orderBy("createdAt", "desc")
    .limit(pageSize + 1) as FirebaseFirestore.Query;

  if (opts.type) {
    q = adminDb
      .collection(Collections.LINKS)
      .where("ownerId", "==", ownerId)
      .where("isDeleted", "==", false)
      .where("type", "==", opts.type)
      .orderBy("createdAt", "desc")
      .limit(pageSize + 1);
  }

  if (opts.cursor) {
    const cursorDoc = await adminDb.collection(Collections.LINKS).doc(opts.cursor).get();
    if (cursorDoc.exists) q = q.startAfter(cursorDoc);
  }

  const snap = await q.get();
  const hasMore = snap.docs.length > pageSize;
  const docs = snap.docs.slice(0, pageSize);
  const links = docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Link, "id">) }));

  return { links, hasMore };
}

export async function getLinkById(id: string, ownerId: string): Promise<Link | null> {
  const doc = await adminDb.collection(Collections.LINKS).doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data() as Omit<Link, "id">;
  if (data.ownerId !== ownerId || data.isDeleted) return null;
  return { id: doc.id, ...data };
}

export async function updateLink(id: string, ownerId: string, input: UpdateLinkInput): Promise<Link> {
  const doc = await adminDb.collection(Collections.LINKS).doc(id).get();
  if (!doc.exists) throw Object.assign(new Error("Link not found"), { status: 404 });

  const data = doc.data() as Omit<Link, "id">;
  if (data.ownerId !== ownerId) throw Object.assign(new Error("Forbidden"), { status: 403 });

  const updates = { ...input, updatedAt: new Date() };
  await adminDb.collection(Collections.LINKS).doc(id).update(updates);

  const updated = { id, ...data, ...updates } as Link;

  await kvSet(updated.shortCode, {
    id,
    originalUrl: updated.originalUrl,
    isActive: updated.isActive,
    expiresAt: updated.expiresAt?.getTime(),
    clickLimit: updated.clickLimit,
    clickCount: updated.clickCount,
    password: updated.password,
  });

  return updated;
}

export async function deleteLink(id: string, ownerId: string): Promise<void> {
  const doc = await adminDb.collection(Collections.LINKS).doc(id).get();
  if (!doc.exists) throw Object.assign(new Error("Link not found"), { status: 404 });

  const data = doc.data() as Link;
  if (data.ownerId !== ownerId) throw Object.assign(new Error("Forbidden"), { status: 403 });

  await adminDb.collection(Collections.LINKS).doc(id).update({
    isDeleted: true,
    isActive: false,
    updatedAt: FieldValue.serverTimestamp(),
  });

  await kvDelete(data.shortCode);
}
