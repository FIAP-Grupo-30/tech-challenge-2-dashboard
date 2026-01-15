import { z } from 'zod';

const variables = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
};

const schema = z.object({
  API_BASE_URL: z.url(),
});

export const ENV = {
  ...schema.parse(variables),
};
