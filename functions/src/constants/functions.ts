export const CONSTANTS = {
	APP_NAME: "Rich-Ranking.",
	MAX_BATCH_SIZE: 500,
	DEFAULT_REGION: "asia-northeast1",
	DEFAULT_TIMEZONE: "Asia/Tokyo",
	MAX_INSTANCES: 3,
	MAX_TOKENS: 1000,
} as const;

export const FUNCTIONS = {
	callSaveReceipt: "callSaveReceipt",
	docCreatedReceipt: "docCreatedReceipt",
	scheduleMidnight: "scheduleMidnight",
} as const;

export const SCHEDULE = {
	allDayMidnight: "50 23 * * *",
} as const;
