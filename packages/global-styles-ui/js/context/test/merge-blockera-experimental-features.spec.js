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
			blockeraLineHeights: {
				custom: [{ slug: 'relaxed', size: '1.8' }],
			},
			blockeraDefaultLineHeights: true,
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
		expect(merged.blockeraLineHeights).toEqual({
			custom: [{ slug: 'relaxed', size: '1.8' }],
		});
		expect(merged.blockeraDefaultLineHeights).toBe(true);
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
