// Cliente HTTP minimal. Luego puedes leer VITE_API_URL.
const delay = (ms) => new Promise(r => setTimeout(r, ms));

export const http = {
  get: async (url) => { await delay(150); return { data: [] }; },
  post: async (url, body) => { await delay(150); return { data: body }; },
};
