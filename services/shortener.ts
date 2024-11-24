import { nanoid } from 'nanoid';

const kv = await Deno.openKv();

export async function shortenUrl(url: string) {
	const token = nanoid(4);
	const key = ["url", token];
	// expires in 14 days
	await kv
		.atomic()
		.check({ key, versionstamp: null })
		.set(["url", token], url)
		.commit();
	return token;
}

export async function customiseShortenedUrl(original: string, customised: string) {
	const originalKey = ["url", original];
	const originalShortened = await kv.get<string>(originalKey);
	const customisedKey = ["url", customised];

	// check if customised already exists
	if (await kv.get(customisedKey)) {
		throw new Error("Customised url already exists");
	}

	await kv
		.atomic()
		.check(originalShortened)
		.check({ key: customisedKey, versionstamp: null })
		.delete(originalKey)
		.set(customisedKey, originalShortened.value as string)
		.commit();
	return customised;
}

export async function resolveUrl(token: string): Promise<string | null> {
	const key = ["url", token];
	const url = await kv.get(key);
	if (!url) return null;
	return url.value as string;
}
