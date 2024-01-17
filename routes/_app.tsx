import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
	return (
		<html>
		<head>
			<meta charset="utf-8"/>
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1.0"
			/>
			<title>Pendekin | Workshop Riset Informatika</title>
			<link
				rel="stylesheet"
				href="/styles.css"
			/>
			<link
				rel="preconnect"
				href="https://fonts.googleapis.com"
			/>
			<link
				rel="preconnect"
				href="https://fonts.gstatic.com"
				crossOrigin
			/>
			<link
				href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap"
				rel="stylesheet"
			/>
		</head>
		<body>
		<Component/>
		</body>
		</html>
	);
}
