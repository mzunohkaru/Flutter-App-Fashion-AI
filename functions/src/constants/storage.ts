export const STORAGE_PATHS = {
	users: {
		root: `user/v1/users`,
		userId: (userId: string) => `${STORAGE_PATHS.users.root}/${userId}`,
		images: (userId: string) => `${STORAGE_PATHS.users.userId(userId)}/images`,
		receipt: (userId: string) =>
			`${STORAGE_PATHS.users.images(userId)}/receipt/v1`,
	},
} as const;
