export type {
  AssetType,
  SteamGridDBAsset,
  SteamGridDBGame,
  AssetFetchOptions,
  GameConfig,
  GameAssetPreferences,
} from './types';

export { normalizePreferenceIds } from './types';

export {
  GAME_REGISTRY,
  getGameConfig,
  getSteamGridDbId,
  getPreferredAssetId,
  getKnownGameTypes,
} from './games';

export { SteamGridDBClient } from './client';
export type { SteamGridDBClientOptions } from './client';

export { AssetCache } from './cache';
