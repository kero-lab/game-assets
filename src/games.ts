import type { AssetType, GameConfig } from './types';

/**
 * Registry of all known games with their SteamGridDB IDs,
 * display metadata, and curated asset preferences.
 *
 * Keyed by the Pterodactyl game type slug (lowercase).
 * This is the single source of truth — no more duplicating
 * KNOWN_GAME_IDS / PREFERRED_ICON_IDS across apps.
 */
export const GAME_REGISTRY: Record<string, GameConfig> = {
  minecraft: {
    steamGridDbId: 38365,
    displayName: 'Minecraft',
    color: { primary: '#5D8731' },
    preferredAssets: { icons: 3777 },
  },
  valheim: {
    steamGridDbId: 29531,
    displayName: 'Valheim',
    color: { primary: '#4A6741' },
  },
  factorio: {
    steamGridDbId: 10052,
    displayName: 'Factorio',
    color: { primary: '#E89D43' },
    preferredAssets: { icons: 16102 },
  },
  terraria: {
    steamGridDbId: 1226,
    displayName: 'Terraria',
    color: { primary: '#5AC4D2' },
    preferredAssets: { icons: 41087 },
  },
  mindustry: {
    steamGridDbId: 5248037,
    displayName: 'Mindustry',
    color: { primary: '#6BB25D' },
    preferredAssets: { icons: 45977 },
  },
  csgo: {
    steamGridDbId: 5363838,
    displayName: 'Counter-Strike',
    color: { primary: '#DE9B35' },
  },
};

export function getGameConfig(gameType: string): GameConfig | undefined {
  return GAME_REGISTRY[gameType];
}

export function getSteamGridDbId(gameType: string): number | undefined {
  return GAME_REGISTRY[gameType]?.steamGridDbId;
}

export function getPreferredAssetId(
  gameType: string,
  assetType: AssetType,
): number | undefined {
  return GAME_REGISTRY[gameType]?.preferredAssets?.[assetType];
}

export function getKnownGameTypes(): string[] {
  return Object.keys(GAME_REGISTRY);
}
