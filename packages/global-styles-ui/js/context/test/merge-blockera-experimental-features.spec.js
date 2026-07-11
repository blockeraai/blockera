import { mergeBlockeraSettingsIntoExperimentalFeatures } from '../merge-blockera-experimental-features';

describe('mergeBlockeraSettingsIntoExperimentalFeatures', () => {
	it('overlays blockera line heights without dropping core typography keys', () => {
		const current = {
			typography: {
				fontSizes: {
					theme: [{ slug: 'small', size: '14px' }],
				},
			},
		};

		const blockera = {
			blockera: {
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
		});
		expect(merged.blockera).toEqual({
			blockeraLineHeights: {
				custom: [{ slug: 'relaxed', size: '1.8' }],
			},
			blockeraDefaultLineHeights: true,
		});
	});

	it('merges Blockera-only preset groups under settings.blockera', () => {
		const merged = mergeBlockeraSettingsIntoExperimentalFeatures(
			{ blockera: { blockeraTransition: { presets: { old: true } } } },
			{
				blockera: {
					blockeraTransition: { presets: { theme: [] } },
				},
			}
		);

		expect(merged.blockera.blockeraTransition).toEqual({
			presets: { theme: [] },
		});
	});
});
