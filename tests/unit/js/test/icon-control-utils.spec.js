/**
 * External dependencies
 */
import { addFilter, removeAllFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import {
	isCustomIcon,
	svgHasPreservedColors,
	prepareSvgForPreviewDisplay,
	getCustomSvgDraft,
	getCustomIconFeatureType,
	isCustomIconUploadLocked,
	isProIconClickBlocked,
	sanitizeRawSVGString,
} from '../../../../packages/global-packages/packages/controls/js/libs/icon-control/utils';

describe('isCustomIcon', () => {
	it('returns false for empty or library icons', () => {
		expect(isCustomIcon(null)).toBe(false);
		expect(isCustomIcon({ icon: 'home', library: 'ui' })).toBe(false);
	});

	it('detects custom SVG from svgString, upload object, upload path, or rendered-only icons', () => {
		expect(isCustomIcon({ svgString: '<svg></svg>' })).toBe(true);
		expect(
			isCustomIcon({ uploadSVG: { url: 'https://example.com/a.svg' } })
		).toBe(true);
		expect(isCustomIcon({ uploadSVG: '/uploads/a.svg' })).toBe(true);
		expect(isCustomIcon({ renderedIcon: 'PHN2Zz4=' })).toBe(true);
	});
});

describe('svgHasPreservedColors', () => {
	it('returns false for empty, currentColor, none, or url() fills', () => {
		expect(svgHasPreservedColors('')).toBe(false);
		expect(
			svgHasPreservedColors('<svg fill="currentColor"><path /></svg>')
		).toBe(false);
		expect(svgHasPreservedColors('<svg fill="none"><path /></svg>')).toBe(
			false
		);
		expect(
			svgHasPreservedColors('<svg style="fill: url(#g)"><path /></svg>')
		).toBe(false);
	});

	it('returns true when a hardcoded fill paint is present', () => {
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

describe('prepareSvgForPreviewDisplay', () => {
	it('returns empty string for invalid input', () => {
		expect(prepareSvgForPreviewDisplay('')).toBe('');
		expect(prepareSvgForPreviewDisplay(null)).toBe('');
	});

	it('sizes a viewBox-only SVG to the preview box', () => {
		const sized = prepareSvgForPreviewDisplay(
			'<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>',
			50
		);

		expect(sized).toContain('width="50"');
		expect(sized).toContain('height="50"');
	});
});

describe('getCustomSvgDraft', () => {
	it('returns empty draft for missing icons', () => {
		expect(getCustomSvgDraft(null)).toEqual({
			svgString: '',
			uploadSVG: null,
		});
	});

	it('prefers svgString and keeps a valid upload object', () => {
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

		expect(getCustomSvgDraft({ renderedIcon: '@@@' })).toEqual({
			svgString: '',
			uploadSVG: null,
		});
	});
});

describe('custom icon companion lock', () => {
	afterEach(() => {
		removeAllFilters('blockera.products.isCompanionPlugin');
		removeAllFilters(
			'blockera.controls.iconControl.customIcon.featureType'
		);
	});

	it('locks uploads unless the companion plugin is active', () => {
		expect(getCustomIconFeatureType()).toBe('companion');
		expect(isCustomIconUploadLocked()).toBe(true);

		addFilter(
			'blockera.products.isCompanionPlugin',
			'test',
			() => true
		);

		expect(getCustomIconFeatureType()).toBe('none');
		expect(isCustomIconUploadLocked()).toBe(false);
	});
});

describe('isProIconClickBlocked', () => {
	it('returns false without a target', () => {
		expect(isProIconClickBlocked({})).toBe(false);
		expect(isProIconClickBlocked({ target: null })).toBe(false);
	});

	it('blocks clicks on Pro-locked SVG icons', () => {
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.classList.add('blockera-is-pro-icon');
		const path = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'path'
		);
		svg.appendChild(path);

		expect(isProIconClickBlocked({ target: svg })).toBe(true);
		expect(isProIconClickBlocked({ target: path })).toBe(true);
		expect(
			isProIconClickBlocked({ target: document.createElement('div') })
		).toBeFalsy();
	});
});

describe('sanitizeRawSVGString', () => {
	it('returns empty for non-strings and non-renderable markup', () => {
		expect(sanitizeRawSVGString('')).toBe('');
		expect(sanitizeRawSVGString(null)).toBe('');
		expect(sanitizeRawSVGString('<div>not svg</div>')).toBe('');
		expect(console).toHaveWarned();
	});

	it('strips scripts, event handlers, and javascript hrefs', () => {
		const sanitized = sanitizeRawSVGString(
			'<svg viewBox="0 0 24 24" onclick="alert(1)"><script>alert(1)</script><path d="M0 0h24v24H0z"/><a href="javascript:alert(1)"></a></svg>'
		);

		expect(sanitized).toContain('<svg');
		expect(sanitized).toContain('path');
		expect(sanitized.toLowerCase()).not.toContain('<script');
		expect(sanitized.toLowerCase()).not.toContain('<a');
		expect(sanitized.toLowerCase()).not.toContain('onclick');
		expect(sanitized.toLowerCase()).not.toContain('javascript:');
	});

	it('keeps a single renderable root svg', () => {
		const sanitized = sanitizeRawSVGString(
			'<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4"/></svg>'
		);

		expect(sanitized).toContain('circle');
		expect(sanitized).toContain('viewBox');
	});
});
