import { HttpsError, type CallableRequest } from "firebase-functions/v2/https";

export function validateAuthentication(request: CallableRequest): string {
	if (!request.auth) {
		throw new HttpsError(
			"unauthenticated",
			"The function must be called while authenticated.",
		);
	}

	return request.auth.uid;
}
