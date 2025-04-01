import { db } from "../config/firebase";
import type {
	DocumentReference,
	DocumentSnapshot,
	FirestoreDataConverter,
} from "firebase-admin/firestore";

export async function docGetAll<T>(
	collection: string,
	converter: FirestoreDataConverter<T>,
): Promise<FirebaseFirestore.QuerySnapshot<T>> {
	return await db.collection(collection).withConverter(converter).get();
}

export async function docGet<T>(
	docRef: string,
	converter: FirestoreDataConverter<T>,
): Promise<DocumentSnapshot<T>> {
	return await db.doc(docRef).withConverter(converter).get();
}

export async function docCreate<T>(
	collection: string,
	converter: FirestoreDataConverter<T>,
	data: T,
): Promise<void> {
	await db.collection(collection).withConverter(converter).add(data);
}

export async function docUpsert<T>(
	docRef: string,
	converter: FirestoreDataConverter<T>,
	data: T,
): Promise<void> {
	await db.doc(docRef).withConverter(converter).set(data, { merge: true });
}

export async function docUpdate<T extends { [key: string]: any }>(
	docRef: string,
	converter: FirestoreDataConverter<T>,
	data: T,
): Promise<void> {
	await db.doc(docRef).withConverter(converter).update(data);
}

export async function docDelete(docRef: string): Promise<void> {
	await db.doc(docRef).delete();
}

export function docRef<T>(
	docRef: string,
): DocumentReference<T, FirebaseFirestore.DocumentData> {
	return db.doc(docRef) as DocumentReference<T, FirebaseFirestore.DocumentData>;
}
