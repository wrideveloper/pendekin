import { nanoid } from 'nanoid';

const kv = await Deno.openKv();

export async function shortenUrl(url: string) {
	const token = nanoid(4);
	const key = ["url", token];
	// expires in 14 days
	await kv
		.atomic()
		.check({ key, versionstamp: null })
		.set(["url", token], url, { expireIn: 14 * 24 * 60 * 60 })
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
		.set(customisedKey, original)
		.commit();
	return customised;
}