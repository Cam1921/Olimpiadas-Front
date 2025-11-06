// src/infrastructure/http/client.js
const delay = (ms) => new Promise(r => setTimeout(r, ms));

export const http = {
  get: async (url) => { await delay(150); return { data: [] }; },
  post: async (url, body) => { await delay(150); return { data: body }; },
};
