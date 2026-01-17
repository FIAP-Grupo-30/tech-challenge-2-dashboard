import { z } from "zod";

const variables = {
	API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
	REMOTE_ROOT_URL: import.meta.env.VITE_REMOTE_ROOT_URL,
	REMOTE_FINANCEIRO_URL: import.meta.env.VITE_REMOTE_FINANCEIRO_URL,
	REMOTE_DASHBOARD_URL: import.meta.env.VITE_REMOTE_DASHBOARD_URL,
	REMOTE_BASE_URL: import.meta.env.VITE_REMOTE_BASE_URL,
};

const schema = z.object({
	API_BASE_URL: z.url(),
	REMOTE_ROOT_URL: z.url(),
	REMOTE_FINANCEIRO_URL: z.url(),
	REMOTE_DASHBOARD_URL: z.url(),
	REMOTE_BASE_URL: z.url(),
});

export const ENV = {
	...schema.parse(variables),
};
