/**
 * PodcastIndex API Types
 */

export interface AuthHeaders {
  'User-Agent': string;
  'X-Auth-Key': string;
  'X-Auth-Date': string;
  Authorization: string;
}

export interface AuthConfig {
  apiKey: string;
  apiSecret: string;
  userAgent?: string;
}

export interface ApiResponse<T> {
  status: 'true' | 'false' | boolean;
  feeds?: T[];
  feed?: T;
  items?: T[];
  count?: number;
  query?: string;
  description?: string;
}

export interface Podcast {
  id: number;
  podcastGuid?: string;
  title: string;
  url: string;
  originalUrl?: string;
  link?: string;
  description?: string;
  author?: string;
  ownerName?: string;
  image?: string;
  artwork?: string;
  lastUpdateTime?: number;
  lastCrawlTime?: number;
  lastParseTime?: number;
  lastGoodHttpStatusTime?: number;
  lastHttpStatus?: number;
  contentType?: string;
  itunesId?: number;
  generator?: string;
  language?: string;
  type?: number;
  dead?: number;
  crawlErrors?: number;
  parseErrors?: number;
  categories?: Record<string, string>;
  locked?: number;
  explicit?: boolean;
  medium?: string;
  episodeCount?: number;
  imageUrlHash?: number;
  newestItemPubdate?: number;
  oldestItemPubdate?: number;
  trendScore?: number;
}

export interface Episode {
  id: number;
  title: string;
  link?: string;
  description?: string;
  guid?: string;
  datePublished?: number;
  datePublishedPretty?: string;
  dateCrawled?: number;
  enclosureUrl?: string;
  enclosureType?: string;
  enclosureLength?: number;
  duration?: number;
  explicit?: number;
  episode?: number;
  episodeType?: string;
  season?: number;
  image?: string;
  feedItunesId?: number;
  feedImage?: string;
  feedId?: number;
  feedTitle?: string;
  feedLanguage?: string;
  feedDead?: number;
  feedDuplicateOf?: number;
  chaptersUrl?: string;
  transcriptUrl?: string;
  soundbite?: Soundbite;
  soundbites?: Soundbite[];
  persons?: Person[];
  socialInteract?: SocialInteract[];
  value?: Value;
}

export interface Soundbite {
  startTime: number;
  duration: number;
  title?: string;
}

export interface Person {
  id: number;
  name: string;
  role?: string;
  group?: string;
  href?: string;
  img?: string;
}

export interface SocialInteract {
  url: string;
  protocol?: string;
  accountId?: string;
  accountUrl?: string;
  priority?: number;
}

export interface Value {
  model?: ValueModel;
  destinations?: ValueDestination[];
}

export interface ValueModel {
  type: string;
  method: string;
  suggested?: string;
}

export interface ValueDestination {
  name?: string;
  address: string;
  type: string;
  split: number;
  fee?: boolean;
  customKey?: string;
  customValue?: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Stats {
  feedCountTotal: number;
  episodeCountTotal: number;
  feedsWithNewEpisodes3days: number;
  feedsWithNewEpisodes10days: number;
  feedsWithNewEpisodes30days: number;
  feedsWithNewEpisodes90days: number;
  feedsWithValueBlocks: number;
}

// Search params
export interface SearchByTermParams {
  q: string;
  max?: number;
  val?: 'any' | 'lightning' | 'hive' | 'webmonetization';
  clean?: boolean;
  fulltext?: boolean;
}

export interface SearchByTitleParams {
  q: string;
  max?: number;
  clean?: boolean;
  fulltext?: boolean;
}

export interface SearchByPersonParams {
  q: string;
  max?: number;
  fulltext?: boolean;
}

// Error classes
export class PodcastIndexError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public responseBody?: unknown
  ) {
    super(message);
    this.name = 'PodcastIndexError';
  }
}

export class AuthenticationError extends PodcastIndexError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends PodcastIndexError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

export class ValidationError extends PodcastIndexError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}
