import { nanoid } from 'nanoid';

const kv = await Deno.openKv();
const KEY_EXPIRY = 14 * 24 * 60 * 60; // 14 days

export async function shortenUrl(url: string) {
	const token = nanoid(4);
	const key = ["url", token];
	// expires in 14 days
	await kv
		.atomic()
		.check({ key, versionstamp: null })
		.set(["url", token], url, { expireIn: KEY_EXPIRY })
		.commit();
	return token;
}

export async function customiseShortenedUrl(original: string, customised: string) {
	const originalKey = ["url", original];
	const originalShortened = await kv.get(originalKey);
	const customisedKey = ["url", customised];
	await kv
		.atomic()
		.check(originalShortened)
		.check({ key: customisedKey, versionstamp: null })
		.delete(originalKey)
		.set(customisedKey, originalShortened.value as string, { expireIn: KEY_EXPIRY })
		.commit();
	return customised;
}

export async function resolveUrl(token: string): Promise<string | null> {
	const key = ["url", token];
	const url = await kv.get(key);
	if (!url) return null;
	return url.value as string;
}