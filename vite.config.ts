import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { z } from "zod";

const schema = z.object({
	VITE_API_BASE_URL: z.url(),
	VITE_REMOTE_ROOT_URL: z.url(),
	VITE_REMOTE_FINANCEIRO_URL: z.url(),
	VITE_REMOTE_DASHBOARD_URL: z.url(),
	VITE_REMOTE_BASE_URL: z.url(),
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const ENV = schema.parse(loadEnv(mode, process.cwd(), ""));

	return {
		plugins: [
			react(),
			tailwindcss(),
			federation({
				name: "@bytebank/dashboard",
				filename: "remoteEntry.js",
				exposes: {
					"./bytebank-dashboard": "./src/exposes/bytebank-dashboard.tsx",
				},
				remotes: {
					"@bytebank/root": ENV.VITE_REMOTE_ROOT_URL,
				},
				shared: ["react", "react-dom", "react-router-dom"],
			}),
		],
		build: {
			modulePreload: false,
			target: "esnext",
			minify: false,
			cssCodeSplit: false,
		},
		server: {
			port: 9000,
			fs: {
				allow: ["."],
			},
		},
		preview: {
			port: 9003,
		},
	};
});
