/**
 * Polyfill TextDecoder and TextEncoder for Jest test environment.
 * These are Web APIs that client-zip and other packages may use.
 * In Node.js 11+, these are available as globals, but Jest's test environment
 * might not have them, so we polyfill them if missing.
 */
if (typeof global.TextDecoder === 'undefined') {
	// In Node.js 11+, TextDecoder is a global
	if (typeof TextDecoder !== 'undefined') {
		global.TextDecoder = TextDecoder;
	} else {
		// Minimal polyfill using Buffer
		global.TextDecoder = class TextDecoder {
			constructor(encoding = 'utf-8') {
				this.encoding = encoding;
			}
			decode(input) {
				if (typeof input === 'string') {
					return input;
				}
				if (Buffer.isBuffer(input)) {
					return input.toString(this.encoding);
				}
				if (input instanceof Uint8Array) {
					return Buffer.from(input).toString(this.encoding);
				}
				if (input && typeof input.buffer === 'object') {
					return Buffer.from(
						input.buffer,
						input.byteOffset,
						input.byteLength
					).toString(this.encoding);
				}
				return String(input);
			}
		};
	}
}

if (typeof global.TextEncoder === 'undefined') {
	// In Node.js 11+, TextEncoder is a global
	if (typeof TextEncoder !== 'undefined') {
		global.TextEncoder = TextEncoder;
	} else {
		// Minimal polyfill using Buffer
		global.TextEncoder = class TextEncoder {
			encode(input) {
				return Buffer.from(String(input), 'utf-8');
			}
		};
	}
}

/**
 * Make window.location configurable for testing.
 * This allows tests to mock window.location.search and other properties.
 */
if (typeof window !== 'undefined' && window.location) {
	try {
		// Try to make window.location configurable so it can be mocked in tests
		const locationDescriptor = Object.getOwnPropertyDescriptor(
			window,
			'location'
		);
		if (locationDescriptor && !locationDescriptor.configurable) {
			// If it's not configurable, we can't change it, but tests can still
			// work around this by using Object.defineProperty on the location object itself
		}
	} catch (e) {
		// Ignore errors - this is just a best-effort attempt
	}
}
