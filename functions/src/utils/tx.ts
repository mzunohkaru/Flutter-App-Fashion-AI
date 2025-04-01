import type {
	DocumentReference,
	DocumentSnapshot,
	Transaction,
} from "firebase-admin/firestore";

export async function tXGet<T>(
	tx: Transaction,
	ref: DocumentReference<T>,
): Promise<DocumentSnapshot<T>> {
	return tx.get(ref);
}

export async function tXGetAll<T>(
	tx: Transaction,
	ref: DocumentReference<T>,
): Promise<DocumentSnapshot<T>[]> {
	return tx.getAll(ref);
}

export async function tXCreate<T>(
	tx: Transaction,
	ref: DocumentReference<T>,
	data: T,
): Promise<void> {
	tx.create(ref, data);
}

export async function tXUpsert<T>(
	tx: Transaction,
	ref: DocumentReference<T>,
	data: T,
): Promise<void> {
	tx.set(ref, data, { merge: true });
}

export async function tXDelete<T>(
	tx: Transaction,
	ref: DocumentReference<T>,
): Promise<void> {
	tx.delete(ref);
}
