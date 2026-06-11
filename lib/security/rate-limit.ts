// lib/security/rate-limit.ts

const rateLimitCache = new Map<string, { count: number; expiresAt: number }>();

/**
 * Limiteur de requêtes simple en mémoire.
 * @param identifier Identifiant unique (ex: userId ou IP)
 * @param limit Nombre de requêtes autorisées
 * @param windowMs Fenêtre de temps en ms (ex: 60000 = 1 min)
 */

export function checkRateLimit(identifier: string, limit = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitCache.get(identifier);

  if (!record || now > record.expiresAt) {
    rateLimitCache.set(identifier, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false; // Limite atteinte
  }

  record.count += 1;
  return true;
}
