import type {
  AssetType,
  SteamGridDBAsset,
  SteamGridDBGame,
  AssetFetchOptions,
} from './types.js';
import { getSteamGridDbId, getPreferredAssetId } from './games.js';

const API_BASE = 'https://www.steamgriddb.com/api/v2';

export interface SteamGridDBClientOptions {
  apiKey: string;
  baseUrl?: string;
}

export class SteamGridDBClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(options: SteamGridDBClientOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? API_BASE;
  }

  /** Fetch assets for a known game by its game type slug. */
  async getAssets(
    gameType: string,
    assetType: AssetType,
    options?: AssetFetchOptions,
  ): Promise<SteamGridDBAsset[] | null> {
    const gameId = getSteamGridDbId(gameType);
    if (!gameId) return null;
    return this.getAssetsByGameId(gameId, assetType, options);
  }

  /** Fetch assets for a game by its SteamGridDB game ID. */
  async getAssetsByGameId(
    gameId: number,
    assetType: AssetType,
    options?: AssetFetchOptions,
  ): Promise<SteamGridDBAsset[] | null> {
    const params = buildQueryParams(options);
    const url = `${this.baseUrl}/${assetType}/game/${gameId}${params}`;

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      if (!res.ok) return null;
      const json = await res.json();
      return (json.data as SteamGridDBAsset[]) ?? null;
    } catch {
      return null;
    }
  }

  /** Fetch a single asset by its SteamGridDB asset ID. */
  async getAssetById(
    assetId: number,
    assetType: AssetType,
  ): Promise<SteamGridDBAsset | null> {
    const url = `${this.baseUrl}/${assetType}/${assetId}`;

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      if (!res.ok) return null;
      const json = await res.json();
      return (json.data as SteamGridDBAsset) ?? null;
    } catch {
      return null;
    }
  }

  /** Search SteamGridDB for games matching a query. */
  async searchGame(query: string): Promise<SteamGridDBGame[] | null> {
    const url = `${this.baseUrl}/search/autocomplete/${encodeURIComponent(query)}`;

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      if (!res.ok) return null;
      const json = await res.json();
      return (json.data as SteamGridDBGame[]) ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Get the best asset URL for a game.
   *
   * Resolution order:
   * 1. If a preferred asset ID exists, fetch it directly
   * 2. Otherwise, fetch by game ID with filters, take first result
   *
   * Returns `thumb` by default (smaller/faster). Set `preferFull: true` for full-res `url`.
   */
  async getBestAssetUrl(
    gameType: string,
    assetType: AssetType,
    options?: AssetFetchOptions & { preferFull?: boolean },
  ): Promise<string | null> {
    const preferFull = options?.preferFull ?? false;

    // Try preferred asset first
    const preferredId = getPreferredAssetId(gameType, assetType);
    if (preferredId) {
      const asset = await this.getAssetById(preferredId, assetType);
      if (asset) {
        return preferFull ? asset.url : (asset.thumb || asset.url);
      }
    }

    // Fallback: fetch by game ID, take top result
    const { preferFull: _, ...fetchOptions } = options ?? {};
    const assets = await this.getAssets(gameType, assetType, {
      ...fetchOptions,
      limit: 1,
    });
    if (!assets || assets.length === 0) return null;

    const best = assets[0];
    return preferFull ? best.url : (best.thumb || best.url);
  }
}

function buildQueryParams(options?: AssetFetchOptions): string {
  if (!options) return '';

  const params = new URLSearchParams();

  const arrayKeys = ['styles', 'mimes', 'dimensions', 'types'] as const;
  for (const key of arrayKeys) {
    const value = options[key];
    if (value && value.length > 0) {
      params.set(key, value.join(','));
    }
  }

  const scalarKeys = ['nsfw', 'humor', 'limit', 'page'] as const;
  for (const key of scalarKeys) {
    const value = options[key];
    if (value !== undefined) {
      params.set(key, String(value));
    }
  }

  const str = params.toString();
  return str ? `?${str}` : '';
}
