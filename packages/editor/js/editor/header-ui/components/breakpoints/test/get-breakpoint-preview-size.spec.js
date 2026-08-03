/**
 * Internal dependencies
 */
import defaultBreakpoints from '../../../../../extensions/libs/block-card/block-states/default-breakpoints';
import {
	getBreakpointPreviewSize,
	applyBreakpointPreviewSize,
} from '../get-breakpoint-preview-size';

describe('getBreakpointPreviewSize', () => {
	const breakpoints = defaultBreakpoints();

	it('returns null for the base breakpoint', () => {
		expect(getBreakpointPreviewSize('desktop', breakpoints)).toBeNull();
	});

	it('previews max-width breakpoints at their max bound', () => {
		expect(getBreakpointPreviewSize('tablet', breakpoints)).toEqual({
			width: '991px',
			minWidth: '',
			maxWidth: '991px',
		});
	});

	it('previews min-width breakpoints at their min bound', () => {
		const largeBreakpoints = {
			...breakpoints,
			'l-desktop': {
				...breakpoints['l-desktop'],
				status: true,
			},
		};

		expect(getBreakpointPreviewSize('l-desktop', largeBreakpoints)).toEqual(
			{
				width: '1280px',
				minWidth: '1280px',
				maxWidth: '1439px',
			}
		);
	});

	it('locks the largest min-width breakpoint to its min bound', () => {
		const largeBreakpoints = {
			...breakpoints,
			'2xl-desktop': {
				...breakpoints['2xl-desktop'],
				status: true,
			},
		};

		expect(
			getBreakpointPreviewSize('2xl-desktop', largeBreakpoints)
		).toEqual({
			width: '1920px',
			minWidth: '1920px',
			maxWidth: '1920px',
		});
	});
});

describe('applyBreakpointPreviewSize', () => {
	it('sets CSS variables for non-base breakpoints', () => {
		const iframe = document.createElement('iframe');
		const breakpoints = defaultBreakpoints();

		applyBreakpointPreviewSize(iframe, 'tablet', breakpoints);

		expect(
			iframe.style.getPropertyValue('--blockera-breakpoint-preview-width')
		).toBe('991px');
		expect(
			iframe.style.getPropertyValue(
				'--blockera-breakpoint-preview-max-width'
			)
		).toBe('991px');
	});

	it('clears preview sizing for the base breakpoint', () => {
		const iframe = document.createElement('iframe');
		const breakpoints = defaultBreakpoints();

		applyBreakpointPreviewSize(iframe, 'tablet', breakpoints);
		applyBreakpointPreviewSize(iframe, 'desktop', breakpoints);

		expect(
			iframe.style.getPropertyValue('--blockera-breakpoint-preview-width')
		).toBe('');
		expect(iframe.style.width).toBe('100%');
	});
});
