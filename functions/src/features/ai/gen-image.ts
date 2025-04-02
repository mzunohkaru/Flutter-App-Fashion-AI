import * as fs from "fs/promises";
import * as path from "path";

import { openai } from "../../config/open-ai";
import { CONSTANTS } from "../../constants/functions";
import { PROMPT } from "../../model/prompt";

export async function generateImage(
	userBase64: string,
	clothBase64: string,
): Promise<string> {
	const completion = await openai.chat.completions.create({
		model: "chatgpt-4o-latest",
		messages: [
			{
				role: "user",
				content: [
					{
						type: "image_url",
						image_url: {
							url: `data:image/jpeg;base64,${userBase64}`,
						},
					},
					{
						type: "image_url",
						image_url: {
							url: `data:image/jpeg;base64,${clothBase64}`,
						},
					},
				],
			},
		],
		max_tokens: CONSTANTS.MAX_TOKENS,
	});

	const content = completion.choices[0]?.message?.content;

	if (!content) {
		throw new Error("OpenAI response is empty");
	}

	console.log("Generated prompt:", `${content}\n${PROMPT}`);

	try {
		const result = await openai.images.generate({
			model: "dall-e-3",
			prompt: `${content}\n${PROMPT}`,
			n: 1,
			size: "1024x1024",
		});

		if (!result.data[0].url) {
			throw new Error("Image generation error: No URL returned");
		}

		return result.data[0].url;
	} catch (error) {
		throw new Error(`Image generation error: ${error}`);
	}
}

async function main(
	userImagePath: string,
	clothImagePath: string,
): Promise<string> {
	try {
		const userBase64 = await fs.readFile(userImagePath, { encoding: "base64" });
		const clothBase64 = await fs.readFile(clothImagePath, {
			encoding: "base64",
		});

		return await generateImage(userBase64, clothBase64);
	} catch (error) {
		throw new Error(`Image generation failed: ${error}`);
	}
}

// テスト用の実行コード
if (require.main === module) {
	const userImagePath = path.join(__dirname, "../../assets/user.png");
	const clothImagePath = path.join(__dirname, "../../assets/cloths.png");

	main(userImagePath, clothImagePath)
		.then((result) => console.log("Generated image URL:", result))
		.catch((error) => console.error("Error:", error));
}
