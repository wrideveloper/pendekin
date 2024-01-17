import { Handlers } from "$fresh/src/server/types.ts";
import { resolveUrl } from "../services/shortener.ts";

export const handler: Handlers = {
	async GET(req, ctx) {
		const url = ctx.params.url as string;
		const resolved = await resolveUrl(url);
		if (!resolved) return new Response("Not found", { status: 404 });
		return Response.redirect(resolved, 301);
	},
};