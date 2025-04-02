import { FUNCTIONS } from "./constants/functions";
import * as handler from "./handler/index";

if (
	!process.env.FUNCTION_TARGET ||
	process.env.FUNCTION_TARGET === FUNCTIONS.callGenImage
) {
	exports.callGenImage = handler.callGenImage;
}
