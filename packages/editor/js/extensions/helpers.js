// @flow

export const getNormalizedCacheVersion = (version: string): string =>
	version.replace(/\./g, '_');
