/** Resolves a file in /public against Vite's base path (e.g. "/awen-labs/"). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
