import { Handlers, PageProps, RouteContext } from "$fresh/src/server/types.ts";
import { nanoid } from "nanoid";
import ShortenedModal from "../islands/ShortenedModal.tsx";

export const handler: Handlers = {
	GET(req, ctx) {
		return ctx.render();
	},
	async POST(req, ctx) {
		const kv = await Deno.openKv();
		const form = await req.formData();
		const originalUrl = form.get("url") as string;
		if (!originalUrl) {
			return ctx.render({
				error: "URL cannot be empty",
			});
		}

		const shortenedUrl = nanoid(4);
		// 14 days
		await kv.set(["url", shortenedUrl], originalUrl, { expireIn: 60 * 60 * 24 * 14 });

		const url = new URL(shortenedUrl, "https://s.wridev.id");
		console.log({ originalUrl, shortenedUrl, url })
		return ctx.render({
			url: url.toString(),
		});
	},
};

export default function Home(props: PageProps<{ url: string }>) {
	return (
		<div className="flex flex-col gap-10 items-center justify-center h-full">
			<img
				src="/assets/wri-logo.png"
				alt="WRI Logo"
				class="w-72"
			/>
			<form
				method="POST"
				className="flex items-center gap-4 p-4 rounded-lg bg-white shadow-lg border border-slate-200"
			>
				<input
					type="text"
					name="url"
					placeholder="Insert your URL here"
					className="input input-bordered w-full max-w-2xl"
				/>
				<button
					type="submit"
					className="btn btn-primary uppercase"
				>
					Shorten
				</button>
			</form>
			<ShortenedModal url={"R1ve"}/>
		</div>
	);
}
