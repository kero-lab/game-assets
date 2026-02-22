/** The four SteamGridDB asset categories. */
export type AssetType = 'icons' | 'heroes' | 'grids' | 'logos';

/** A single asset returned by the SteamGridDB API. */
export interface SteamGridDBAsset {
  id: number;
  score: number;
  style: string[];
  url: string;
  thumb: string;
  tags: string[];
  language: string;
  notes: string | null;
  mime: string;
  width: number;
  height: number;
  upvotes: number;
  downvotes: number;
}

/** A game returned by the SteamGridDB search endpoint. */
export interface SteamGridDBGame {
  id: number;
  name: string;
  types: string[];
  verified: boolean;
}

/** Filter options for asset fetch requests. */
export interface AssetFetchOptions {
  styles?: string[];
  mimes?: string[];
  dimensions?: string[];
  types?: string[];
  nsfw?: string;
  humor?: string;
  limit?: number;
  page?: number;
}

/** Configuration for a known game in the RemLab ecosystem. */
export interface GameConfig {
  steamGridDbId: number;
  displayName: string;
  color: { primary: string };
  preferredAssets?: Partial<Record<AssetType, number>>;
}
