/**
 * Normalize WordPress version strings (strip alpha/beta suffixes).
 */
export const normalizeWordPressVersion = (version: string): string => {
	const regexp = /(\d+\.\d+(|\.\d+))-.*/gi;
	const matches = regexp.exec(version);

	if (matches && matches.length > 1) {
		return matches[1];
	}

	return version;
};

/**
 * Compare WordPress semver against a minimum target.
 */
export const isWordPressVersionAtLeast = (
	version: string,
	major: number,
	minor = 0,
	patch = 0
): boolean => {
	const normalized = normalizeWordPressVersion(version);
	const [versionMajor = 0, versionMinor = 0, versionPatch = 0] = normalized
		.split('.')
		.map(Number);

	if (versionMajor !== major) {
		return versionMajor > major;
	}

	if (versionMinor !== minor) {
		return versionMinor > minor;
	}

	return versionPatch >= patch;
};

/**
 * WordPress 7.0 moved Global Styles UI from edit-site into editor/global-styles-ui
 * with renamed DOM class hooks.
 */
export const isWordPress70OrHigher = (version: string): boolean =>
	isWordPressVersionAtLeast(version, 7, 0, 0);

/**
 * Resolve the active WordPress version from Blockera data or bootstrap fallbacks.
 */
export const getWordPressVersion = (): string => {
	try {
		// eslint-disable-next-line @wordpress/no-global-active-element -- runtime store lookup
		const { select } = require('@wordpress/data') as {
			select: (store: string) => {
				getEntity?: (name: string) => { version?: string };
			};
		};
		const version = select('blockera/data')?.getEntity?.('wp')?.version;

		if (version) {
			return version;
		}
	} catch (_error) {
		//
	}

	if (typeof window !== 'undefined') {
		const debugVersion = (
			window as Window & {
				blockeraTelemetryDebugData?: { wordpress_version?: string };
			}
		).blockeraTelemetryDebugData?.wordpress_version;

		if (debugVersion) {
			return debugVersion;
		}
	}

	return '';
};
