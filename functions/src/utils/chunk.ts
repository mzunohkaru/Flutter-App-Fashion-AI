import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { logger } from "firebase-functions/v2";
import { CONSTANTS } from "../constants/functions";

type PropHandleBatchOperation<T> = {
	description: string;
	operation: (doc: QueryDocumentSnapshot<T>) => Promise<void>;
	array: QueryDocumentSnapshot<T>[];
	batch: FirebaseFirestore.WriteBatch;
};

export const handleBatchOperation = async <T>({
	description,
	operation,
	array,
	batch,
}: PropHandleBatchOperation<T>) => {
	const chunkedDocs = _chunk(array, CONSTANTS.MAX_BATCH_SIZE);
	const failedIds: string[] = [];

	await Promise.all(
		chunkedDocs.map(async (chunk) => {
			await Promise.all(
				chunk.map(async (doc) => {
					try {
						await operation(doc);
					} catch (_error) {
						failedIds.push(doc.id);
					}
				}),
			);
			try {
				await batch.commit();
			} catch (error) {
				logger.error(`${description} batch commit failed:`, error);
			}
		}),
	);

	if (failedIds.length) {
		logger.error(`${description} Uid:`, failedIds);
	}
};

type PropHandleProcessAllOperation<T> = {
	description: string;
	operation: (doc: QueryDocumentSnapshot<T>) => Promise<void>;
	array: QueryDocumentSnapshot<T>[];
};

export const handleProcessAllOperation = async <T>({
	description,
	operation,
	array,
}: PropHandleProcessAllOperation<T>) => {
	const chunkedDocs = _chunk(array, CONSTANTS.MAX_BATCH_SIZE);
	const failedIds: string[] = [];

	await Promise.all(
		chunkedDocs.map(async (chunk) => {
			await Promise.all(
				chunk.map(async (doc) => {
					try {
						await operation(doc);
					} catch (_error) {
						failedIds.push(doc.id);
					}
				}),
			);
		}),
	);

	if (failedIds.length) {
		logger.error(`${description} Uid:`, failedIds);
	}
};

function _chunk<T>(array: T[], size: number): T[][] {
	return array.reduce<T[][]>((newArr, _, i) => {
		if (i % size === 0) {
			newArr.push(array.slice(i, i + size) as T[]);
		}
		return newArr;
	}, []);
}
