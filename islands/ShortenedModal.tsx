import { useEffect, useRef } from "preact/hooks"
import { useSignal } from "@preact/signals"
import qrGenerator from "qrcode-generator";
import domToImage from "dom-to-image";
import { CopyIcon } from "../components/icons/ic_copy.tsx";
import { EditIcon } from "../components/icons/ic_edit.tsx";
import { SaveIcon } from "../components/icons/ic_save.tsx";

type ShortenedModalProps = {
	url?: string;
	isUpdated?: boolean;
	error?: string;
};

export default function ShortenedModal(props: ShortenedModalProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const qrContainerRef = useRef<HTMLDivElement>(null);
	const isEditable = useSignal(false);
	const url = useSignal<string>(props.url ?? "");
	const hasCopied = useSignal(false);

	useEffect(() => {
		if (dialogRef.current === null) return;
		if (qrContainerRef.current === null) return;
		if (!props.url) return;
		dialogRef.current.showModal();

		const qrCode = qrGenerator(0, "M");
		qrCode.addData(`https://s.wridev.id/${props.url}`);
		qrCode.make();
		qrContainerRef.current.innerHTML = qrCode.createSvgTag({
			scalable: true,
			margin: 0,
		});
	}, [props.url]);

	async function downloadQrCode() {
		const qrCode = document.getElementById("qr-code") as HTMLDivElement;
		const imageResult = await domToImage.toPng(qrCode);
		const link = document.createElement("a");
		link.download = `s.wridev.id-${props.url}.png`;
		link.href = imageResult;
		link.click();
	}

	return (
		<dialog
			id="modal"
			className="modal"
			ref={dialogRef}
		>
			<div className="modal-box">
				<h3 className="font-bold text-2xl mb-4">
					{props.isUpdated ? "Your link has been updated!" : "Your link is ready!"}
				</h3>
				<div class="mx-auto mb-4 max-w-fit">
					<div
						id="qr-code"
						class="relative p-4 border border-slate-200 rounded-lg max-w-fit bg-white"
					>
						<div
							ref={qrContainerRef}
							class="w-64 h-64"
						/>
						<img
							src="/assets/wri-logo-squared.png"
							class="absolute w-20 h-20 p-2 rounded-lg bg-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
						/>
					</div>
					<a
						class="block text-sm underline text-slate-500 pt-2 outline-none"
						href="javascript:void(0);"
						onClick={downloadQrCode}
					>
						Download QR Code
					</a>
				</div>
				<form
					class="flex justify-between items-center gap-2 border border-slate-200 rounded-lg p-2"
					method="POST"
				>
					<input
						type="hidden"
						name="_method"
						value="PUT"
					/>
					<input
						type="hidden"
						name="original_url"
						value={props.url}
					/>
					<input
						type="hidden"
						name="custom_url"
						value={url}
					/>
					<div
						className="flex items-center"
					>
						<span class="text-lg pl-2 text-slate-600">
							s.wridev.id/
						</span>
						<span
							class={`text-lg font-medium text-slate-800 underline outline-none rounded-md ${isEditable.value ? "py-1 px-2 border border-slate-200" : ""}`}
							contentEditable={isEditable.value}
							onInput={(e) => {
								const value = e.currentTarget.innerText;
								// max custom url length is 25
								if (value.length > 25) return;
								url.value = e.currentTarget.innerText
							}}
						>
							{props.url}
						</span>
						{!isEditable.value && (
							<button
								class="outline-none text-slate-800 pl-1"
								type="button"
								onClick={() => {
									isEditable.value = !isEditable.value;
								}}
							>
								<EditIcon className="w-4 h-4"/>
							</button>
						)}
					</div>
					<button
						type={isEditable.value ? "submit" : "button"}
						className="btn btn-primary"
						onClick={() => {
							navigator.clipboard.writeText(`https://s.wridev.id/${props.url}`);
							hasCopied.value = true;
						}}
					>
						{isEditable.value ? (
							<>
								<SaveIcon className="w-4 h-4 inline-block"/>
								Save
							</>
						) : (
							hasCopied.value ? (
								<>
									<CopyIcon className="w-4 h-4 inline-block"/>
									Copied!
								</>
							) : (
								<>
									<CopyIcon className="w-4 h-4 inline-block"/>
									Copy
								</>
							)
						)}
					</button>
				</form>
				<div className="modal-action">
					<form method="dialog">
						<button className="btn">Close</button>
					</form>
				</div>
			</div>
		</dialog>
	);
}