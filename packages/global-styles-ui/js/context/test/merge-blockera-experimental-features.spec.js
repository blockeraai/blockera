import { mergeBlockeraSettingsIntoExperimentalFeatures } from '../merge-blockera-experimental-features';

describe('mergeBlockeraSettingsIntoExperimentalFeatures', () => {
	it('overlays typography.lineHeights without dropping core typography keys', () => {
		const current = {
			typography: {
				fontSizes: {
					theme: [{ slug: 'small', size: '14px' }],
				},
			},
		};

		const blockera = {
			typography: {
				lineHeights: {
					custom: [{ slug: 'relaxed', size: '1.8' }],
				},
				defaultLineHeights: true,
			},
		};

		const merged = mergeBlockeraSettingsIntoExperimentalFeatures(
			current,
			blockera
		);

		expect(merged.typography).toEqual({
			fontSizes: {
				theme: [{ slug: 'small', size: '14px' }],
			},
			lineHeights: {
				custom: [{ slug: 'relaxed', size: '1.8' }],
			},
			defaultLineHeights: true,
		});
	});

	it('replaces Blockera-only top-level preset groups', () => {
		const merged = mergeBlockeraSettingsIntoExperimentalFeatures(
			{ transition: { presets: { old: true } } },
			{ transition: { presets: { theme: [] } } }
		);

		expect(merged.transition).toEqual({ presets: { theme: [] } });
	});
});
