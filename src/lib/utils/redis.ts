import { Request } from "express";

// Get cache key
export function getCacheKey(req: Request) {
  return `data:${req.query.id}`;
}
