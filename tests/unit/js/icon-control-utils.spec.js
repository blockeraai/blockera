jest.mock('@blockera/icons', () => ({
	Icon: () => null,
	getIcon: jest.fn(),
	iconSearch: jest.fn(),
	isValidIcon: jest.fn(),
	getIconLibraryIcons: jest.fn(),
	getIconLibrary: jest.fn(() => ({})),
	getIconLibrarySearchData: jest.fn(() => []),
	prepareIconSvgForStorage: (markup) => markup,
	extractSvgMarkup: (markup) => markup,
	NativeIconLibrariesList: [],
	createStandardIconObject: jest.fn(),
}));

jest.mock('@blockera/controls/js/libs/button', () => ({
	Button: () => null,
}));

jest.mock('@blockera/controls/js/libs/tooltip', () => ({
	Tooltip: ({ children }) => children,
}));

jest.mock('@blockera/controls/js/libs/feature-wrapper', () => ({
	FeatureWrapper: ({ children }) => children,
}));

jest.mock('@blockera/controls/js/libs/conditional-wrapper', () => ({
	__esModule: true,
	default: ({ children }) => children,
}));

/**
 * Internal dependencies
 */
import {
	getCustomSvgDraft,
	isCustomIcon,
	isProIconClickBlocked,
	sanitizeRawSVGString,
	svgHasPreservedColors,
	getLibraryIconPreviewSize,
} from '@blockera/controls/js/libs/icon-control/utils';

describe('isCustomIcon', () => {
	it('returns false for empty or library icons', () => {
		expect(isCustomIcon(null)).toBe(false);
		expect(isCustomIcon({ icon: 'star', library: 'wp' })).toBe(false);
	});

	it('detects custom SVG strings, uploads, and rendered-only icons', () => {
		expect(isCustomIcon({ svgString: '<svg></svg>' })).toBe(true);
		expect(
			isCustomIcon({ uploadSVG: { url: 'https://example.com/a.svg' } })
		).toBe(true);
		expect(isCustomIcon({ uploadSVG: '/path/icon.svg' })).toBe(true);
		expect(isCustomIcon({ renderedIcon: 'PHN2Zz4=', icon: '' })).toBe(true);
	});
});

describe('svgHasPreservedColors', () => {
	it('returns false for empty markup and currentColor fills', () => {
		expect(svgHasPreservedColors('')).toBe(false);
		expect(
			svgHasPreservedColors('<svg fill="currentColor"><path /></svg>')
		).toBe(false);
		expect(svgHasPreservedColors('<svg fill="none"><path /></svg>')).toBe(
			false
		);
	});

	it('detects hardcoded fill attributes and CSS fill declarations', () => {
		expect(
			svgHasPreservedColors('<svg fill="#0051E7"><path /></svg>')
		).toBe(true);
		expect(
			svgHasPreservedColors(
				'<svg><path style="fill: rgb(0, 0, 0)" /></svg>'
			)
		).toBe(true);
	});
});

describe('getCustomSvgDraft', () => {
	it('returns empty draft for missing icons', () => {
		expect(getCustomSvgDraft(null)).toEqual({
			svgString: '',
			uploadSVG: null,
		});
	});

	it('prefers svgString and keeps upload metadata', () => {
		const uploadSVG = { url: 'https://example.com/a.svg' };

		expect(
			getCustomSvgDraft({
				svgString: '<svg></svg>',
				uploadSVG,
			})
		).toEqual({
			svgString: '<svg></svg>',
			uploadSVG,
		});
	});

	it('decodes renderedIcon and ignores invalid base64', () => {
		expect(
			getCustomSvgDraft({
				renderedIcon: btoa('<svg id="ok"></svg>'),
			})
		).toEqual({
			svgString: '<svg id="ok"></svg>',
			uploadSVG: null,
		});

		expect(
			getCustomSvgDraft({
				renderedIcon: '%%%not-base64%%%',
			})
		).toEqual({
			svgString: '',
			uploadSVG: null,
		});
	});
});

describe('sanitizeRawSVGString', () => {
	it('returns empty string for empty input', () => {
		expect(sanitizeRawSVGString('')).toBe('');
	});

	it('returns empty string for non-svg markup', () => {
		expect(sanitizeRawSVGString('<div></div>')).toBe('');
		expect(console).toHaveWarned();
	});

	it('keeps a renderable svg and strips script tags', () => {
		const sanitized = sanitizeRawSVGString(
			'<svg viewBox="0 0 24 24" onclick="alert(1)"><script>alert(1)</script><path d="M0 0h24v24H0z"/></svg>'
		);

		expect(sanitized).toContain('<svg');
		expect(sanitized).toContain('path');
		expect(sanitized.toLowerCase()).not.toContain('<script');
		expect(sanitized.toLowerCase()).not.toContain('onclick');
	});
});

describe('isProIconClickBlocked', () => {
	it('returns false without a target', () => {
		expect(isProIconClickBlocked({})).toBe(false);
		expect(isProIconClickBlocked({ target: null })).toBe(false);
	});

	it('detects locked Pro icons from the svg class', () => {
		const svg = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'svg'
		);
		svg.classList.add('blockera-is-pro-icon');

		expect(isProIconClickBlocked({ target: svg })).toBe(true);
	});
});

describe('getLibraryIconPreviewSize', () => {
	it('uses 18px for third-party libraries and 24px otherwise', () => {
		expect(getLibraryIconPreviewSize('tabler')).toBe(18);
		expect(getLibraryIconPreviewSize('lucide')).toBe(18);
		expect(getLibraryIconPreviewSize('wp')).toBe(24);
		expect(getLibraryIconPreviewSize('blockera')).toBe(24);
	});
});
