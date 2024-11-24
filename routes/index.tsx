import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import ShortenedModal from "../islands/ShortenedModal.tsx";
import { customiseShortenedUrl, shortenUrl } from "../services/shortener.ts";
import { UrlIcon } from "../components/icons/ic_url.tsx";

type HandlerResponse = {
	url?: string;
	isUpdated?: boolean;
	error?: string;
};

export const handler: Handlers = {
	async POST(req, ctx) {
		const form = await req.formData();
		const method = form.get("_method") as string;
		switch (method) {
			case "PUT": {
				const originalUrl = form.get("original_url") as string;
				const customUrl = form.get("custom_url") as string;
				try {
					const customised = await customiseShortenedUrl(
						originalUrl,
						customUrl,
					);
					return ctx.render({
						url: customised,
						isUpdated: true,
					});
				} catch {
					return ctx.render({ error: "Customised url already exists" });
				}
			}
			default: {
				const originalUrl = form.get("url") as string;
				if (!originalUrl) return ctx.render({ error: "URL cannot be empty" });
				const shortened = await shortenUrl(originalUrl);
				return ctx.render({
					url: shortened,
				});
			}
		}
	},
};

export default function Home(props: PageProps<HandlerResponse>) {
	return (
		<div className="flex flex-col gap-10 items-center justify-center h-full">
			<img src="/assets/wri-logo.png" alt="WRI Logo" class="w-72" />
			<form
				method="POST"
				className="flex items-center gap-4 p-4 rounded-lg bg-white shadow-lg border border-slate-200"
			>
				<input
					type="text"
					name="url"
					placeholder="https://your-domain.com/your-very-long-url"
					className="input input-bordered w-96 max-w-screen-md"
				/>
				<button
					type="submit"
					className="btn btn-primary uppercase flex items-center"
				>
					<UrlIcon className="w-5 h-5" />
					Shorten
				</button>
			</form>
			<ShortenedModal url={props.data?.url} isUpdated={props.data?.isUpdated} />
		</div>
	);
}
