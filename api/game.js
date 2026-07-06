import { gameApiHandler } from '../server/api-handlers.js';

export default async function handler(req, res) {
  await gameApiHandler(req, res);
}
