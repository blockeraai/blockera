import { mergeBlockeraSettingsIntoExperimentalFeatures } from '../merge-blockera-experimental-features';

describe('mergeBlockeraSettingsIntoExperimentalFeatures', () => {
	it('overlays typography.blockeraLineHeights without dropping core typography keys', () => {
		const current = {
			typography: {
				fontSizes: {
					theme: [{ slug: 'small', size: '14px' }],
				},
			},
		};

		const blockera = {
			typography: {
				blockeraLineHeights: {
					custom: [{ slug: 'relaxed', size: '1.8' }],
				},
				blockeraDefaultLineHeights: true,
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
			blockeraLineHeights: {
				custom: [{ slug: 'relaxed', size: '1.8' }],
			},
			blockeraDefaultLineHeights: true,
		});
	});

	it('overlays border.blockeraBorder without dropping core border keys', () => {
		const current = {
			border: {
				radiusSizes: {
					theme: [{ slug: 'small', size: '4px' }],
				},
			},
		};

		const blockera = {
			border: {
				blockeraBorder: {
					presets: {
						custom: [{ slug: 'accent', border: { width: '1px' } }],
					},
				},
			},
		};

		const merged = mergeBlockeraSettingsIntoExperimentalFeatures(
			current,
			blockera
		);

		expect(merged.border).toEqual({
			radiusSizes: {
				theme: [{ slug: 'small', size: '4px' }],
			},
			blockeraBorder: {
				presets: {
					custom: [{ slug: 'accent', border: { width: '1px' } }],
				},
			},
		});
	});

	it('merges Blockera-only preset groups as flat settings keys', () => {
		const merged = mergeBlockeraSettingsIntoExperimentalFeatures(
			{ blockeraTransition: { presets: { old: true } } },
			{
				blockeraTransition: { presets: { theme: [] } },
			}
		);

		expect(merged.blockeraTransition).toEqual({
			presets: { theme: [] },
		});
	});
});
