import { useEffect, useRef } from "preact/hooks"
import { useSignal } from "@preact/signals"
import { CopyIcon } from "../components/icons/ic_copy.tsx";
import { EditIcon } from "../components/icons/ic_edit.tsx";

type ShortenedModalProps = {
	url?: string;
};

export default function ShortenedModal(props: ShortenedModalProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const isEditable = useSignal(false);
	const url = useSignal<string>(props.url ?? "");

	useEffect(() => {
		if (dialogRef.current === null) return;
		if (!props.url) return;
		dialogRef.current.showModal();
	}, [props.url]);

	return (
		<dialog
			id="modal"
			className="modal"
			ref={dialogRef}
		>
			<div className="modal-box">
				<h3 className="font-bold text-lg mb-4">Your link is ready!</h3>
				<form
					class="flex justify-between items-center gap-2 border border-slate-200 rounded-lg p-2"
					method="POST"
				>
					<div
						className="flex items-center"
					>
						<span class="text-lg pl-2 text-slate-600">
							s.wridev.id/
						</span>
						<span
							class={`text-lg font-medium text-slate-800 underline outline-none rounded-md ${isEditable.value ? "py-1 px-2 border border-slate-200" : ""}`}
							contentEditable={isEditable.value}
							onChange={(e) => {
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
						type="button"
						className="btn btn-primary"
						onClick={() => {
							navigator.clipboard.writeText(`https://s.wridev.id/${props.url}`);
						}}
					>
						{isEditable ? (
							<>
							</>
						) : (
							<>
								<CopyIcon className="w-4 h-4 inline-block"/>
								Copy
							</>
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