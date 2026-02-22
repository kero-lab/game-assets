import type { AssetType } from './types';

interface CacheEntry {
  url: string | null;
  cachedAt: number;
}

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * In-memory asset URL cache with TTL.
 *
 * Caches resolved asset URLs (or null for "no result") keyed by
 * `${gameType}:${assetType}`. Prevents repeated API calls within
 * the same server process. Entries auto-expire after `ttlMs` (default 24h).
 */
export class AssetCache {
  private readonly cache = new Map<string, CacheEntry>();
  private readonly ttlMs: number;

  constructor(options?: { ttlMs?: number }) {
    this.ttlMs = options?.ttlMs ?? DEFAULT_TTL_MS;
  }

  private key(gameType: string, assetType: AssetType): string {
    return `${gameType}:${assetType}`;
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.cachedAt > this.ttlMs;
  }

  has(gameType: string, assetType: AssetType): boolean {
    const entry = this.cache.get(this.key(gameType, assetType));
    if (!entry) return false;
    if (this.isExpired(entry)) {
      this.cache.delete(this.key(gameType, assetType));
      return false;
    }
    return true;
  }

  get(gameType: string, assetType: AssetType): string | null | undefined {
    const entry = this.cache.get(this.key(gameType, assetType));
    if (!entry) return undefined;
    if (this.isExpired(entry)) {
      this.cache.delete(this.key(gameType, assetType));
      return undefined;
    }
    return entry.url;
  }

  set(gameType: string, assetType: AssetType, url: string | null): void {
    this.cache.set(this.key(gameType, assetType), { url, cachedAt: Date.now() });
  }

  delete(gameType: string, assetType: AssetType): void {
    this.cache.delete(this.key(gameType, assetType));
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}
