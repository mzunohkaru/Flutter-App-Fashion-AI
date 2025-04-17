export const FIRESTORE_PATHS = {
	documentTriggerPaths: {
		privateUser: "user/v1/users/{userId}",
		receipts: "user/v1/users/{userId}/receipt/v1/receipts/{receiptId}",
	},
	users: {
		root: "user/v1/users",
		userId: (userId: string) => `user/v1/users/${userId}`,
		status: (userId: string) => `user/v1/users/${userId}/status/v1`,
		daily: (userId: string) => `user/v1/users/${userId}/status/v1/daily/v1`,
	},
} as const;
