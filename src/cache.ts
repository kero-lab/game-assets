import type { AssetType } from './types.js';

/**
 * In-memory asset URL cache.
 *
 * Caches resolved asset URLs (or null for "no result") keyed by
 * `${gameType}:${assetType}`. Prevents repeated API calls within
 * the same server process. Resets on restart.
 */
export class AssetCache {
  private readonly cache = new Map<string, string | null>();

  private key(gameType: string, assetType: AssetType): string {
    return `${gameType}:${assetType}`;
  }

  has(gameType: string, assetType: AssetType): boolean {
    return this.cache.has(this.key(gameType, assetType));
  }

  get(gameType: string, assetType: AssetType): string | null | undefined {
    return this.cache.get(this.key(gameType, assetType));
  }

  set(gameType: string, assetType: AssetType, url: string | null): void {
    this.cache.set(this.key(gameType, assetType), url);
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
