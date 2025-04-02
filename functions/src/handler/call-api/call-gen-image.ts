import { onCall } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import { CONSTANTS } from "../../constants/functions";
import { validateAuthentication } from "../../utils/validate-auth";

export const callGenImage = onCall<RequestGenImage>(
	{ region: CONSTANTS.DEFAULT_REGION, maxInstances: CONSTANTS.MAX_INSTANCES },
	async (request) => {
		try {
			const userId = validateAuthentication(request);
			console.log(`userId: ${userId}`);
		} catch (error) {
			logger.error(error);
			const errorRes: ResponseSaveReceipt = {
				success: false,
				error: error instanceof Error ? error.message : String(error),
				code: 500,
			};
			return errorRes;
		}
	},
);
