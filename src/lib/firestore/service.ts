import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue, Filter } from "firebase-admin/firestore";

import {
  type Category,
  type Product,
  type ProductImage,
  type ProductSpecification,
  type Banner,
  type Offer,
  type FAQ,
  type Page,
  type PageSection,
  type SEO,
  type ContactMessage,
  type KnowledgeDocument,
  type KnowledgeChunk,
  type ChatLog,
  type AdminUser,
  COLLECTIONS,
} from "./types";

const adminApp = initializeApp();
const db = getFirestore(adminApp);

function toTimestamp(date?: Date | string | null): Timestamp | undefined {
  if (!date) return undefined;
  return Timestamp.fromDate(new Date(date));
}

function fromTimestamp(ts?: Timestamp): Date | undefined {
  if (!ts) return undefined;
  return ts.toDate();
}

function serializeDoc<T>(
  doc: FirebaseFirestore.DocumentSnapshot
): T | null {
  if (!doc.exists) return null;
  const data = doc.data()!;
  return {
    ...data,
    id: doc.id,
  } as unknown as T;
}

function serializeQuerySnapshot<T>(snapshot: FirebaseFirestore.QuerySnapshot): T[] {
  return snapshot.docs.map((doc) => serializeDoc<T>(doc)!).filter(Boolean);
}

export async function createDocument<T extends { id?: string }>(
  collection: string,
  data: Omit<T, "id" | "createdAt" | "updatedAt">,
  customId?: string
): Promise<T> {
  const now = Timestamp.now();
  const docData: Record<string, unknown> = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  let docRef: FirebaseFirestore.DocumentReference;
  if (customId) {
    docRef = db.collection(collection).doc(customId);
    await docRef.set(docData);
  } else {
    docRef = await db.collection(collection).add(docData);
  }

  return { ...docData, id: docRef.id } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export async function getDocument<T>(collection: string, id: string): Promise<T | null> {
  const doc = await db.collection(collection).doc(id).get();
  return serializeDoc<T>(doc);
}

export async function updateDocument<T extends { id: string }>(
  collection: string,
  id: string,
  data: Partial<Omit<T, "id" | "createdAt">>
): Promise<T | null> {
  const docRef = db.collection(collection).doc(id);
  const updateData = {
    ...data,
    updatedAt: Timestamp.now(),
  };
  await docRef.update(updateData);
  return getDocument<T>(collection, id) as unknown as T;
}

export async function deleteDocument(collection: string, id: string): Promise<boolean> {
  const docRef = db.collection(collection).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return false;
  await docRef.delete();
  return true as unknown as boolean;
}

export async function queryDocuments<T>(
  collection: string,
  filters?: Array<[string, string, unknown]>,
  orderBy?: { field: string; direction: "asc" | "desc" },
  limit?: number,
  offset?: number
): Promise<T[]> {
  let query: FirebaseFirestore.Query = db.collection(collection);

  if (filters) {
    for (const [field, op, value] of filters) {
      query = query.where(field, op as FirebaseFirestore.WhereFilterOp, value);
    }
  }

  if (orderBy) {
    query = query.orderBy(orderBy.field, orderBy.direction);
  }

  if (limit) {
    query = query.limit(limit);
  }

  if (offset) {
    query = query.offset(offset);
  }

  const snapshot = await query.get();
  return serializeQuerySnapshot<T>(snapshot);
}

export async function queryDocumentsWithCursor<T>(
  collection: string,
  filters?: Array<[string, string, unknown]>,
  orderBy?: { field: string; direction: "asc" | "desc" },
  limit?: number,
  startAfterDoc?: FirebaseFirestore.DocumentSnapshot
): Promise<{ items: T[]; lastDoc: FirebaseFirestore.DocumentSnapshot | null }> {
  let query: FirebaseFirestore.Query = db.collection(collection);

  if (filters) {
    for (const [field, op, value] of filters) {
      query = query.where(field, op as FirebaseFirestore.WhereFilterOp, value);
    }
  }

  if (orderBy) {
    query = query.orderBy(orderBy.field, orderBy.direction);
  }

  if (limit) {
    query = query.limit(limit);
  }

  if (startAfterDoc) {
    query = query.startAfter(startAfterDoc);
  }

  const snapshot = await query.get();
  return {
    items: serializeQuerySnapshot<T>(snapshot),
    lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
  };
}

export async function getAllDocuments<T>(
  collection: string,
  orderBy?: { field: string; direction: "asc" | "desc" }
): Promise<T[]> {
  let query: FirebaseFirestore.Query = db.collection(collection);
  if (orderBy) {
    query = query.orderBy(orderBy.field, orderBy.direction);
  }
  const snapshot = await query.get();
  return serializeQuerySnapshot<T>(snapshot);
}

export async function countDocuments(collection: string, filters?: Array<[string, string, unknown]>): Promise<number> {
  let query: FirebaseFirestore.Query = db.collection(collection);
  if (filters) {
    for (const [field, op, value] of filters) {
      query = query.where(field, op as FirebaseFirestore.WhereFilterOp, value);
    }
  }
  const snapshot = await query.count().get();
  return snapshot.data().count;
}

export async function transaction<T>(updateFn: (transaction: FirebaseFirestore.Transaction) => Promise<T>): Promise<T> {
  return db.runTransaction(updateFn);
}

export async function batchWrite(operations: Array<{
  type: "set" | "update" | "delete";
  collection: string;
  id?: string;
  data?: Record<string, unknown>;
}>): Promise<void> {
  const batch = db.batch();
  for (const op of operations) {
    const ref = op.id ? db.collection(op.collection).doc(op.id) : db.collection(op.collection).doc();
    if (op.type === "set") {
      batch.set(ref, { ...op.data, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
    } else if (op.type === "update") {
      batch.update(ref, { ...op.data, updatedAt: Timestamp.now() });
    } else if (op.type === "delete") {
      batch.delete(ref);
    }
  }
  await batch.commit();
}

export { db, Timestamp, FieldValue, Filter };