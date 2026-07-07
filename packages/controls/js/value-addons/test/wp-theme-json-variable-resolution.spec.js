/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Blockera dependencies — import module directly so Jest does not load `@blockera/data` store bootstrap.
 */
import {
	resolveThemeJsonVariableStringFromWpEditor,
	parseThemeJsonVariableToken,
	isThemeJsonVariableResolutionCandidateString,
	isThemeJsonVariableDefinedInMergedFeatures,
	wrapExperimentalFeaturesRaw,
} from '../../../../data/js/variables/theme-json-variable-resolution';

jest.mock('@wordpress/data', () => ({
	select: jest.fn(),
}));

describe('resolveThemeJsonVariableStringFromWpEditor', () => {
	const xfPaletteOnly = {
		color: {
			palette: {
				theme: [{ slug: 'primary', color: '#abc', name: 'Primary' }],
			},
		},
	};

	beforeEach(() => {
		select.mockReset();
	});

	test('leaves non-theme-json strings unchanged', () => {
		select.mockImplementation(() => ({
			getSettings: () => ({
				__experimentalFeatures: xfPaletteOnly,
			}),
		}));

		expect(resolveThemeJsonVariableStringFromWpEditor('10px')).toBe('10px');
		expect(
			resolveThemeJsonVariableStringFromWpEditor('var(--is-blockera)')
		).toBe('var(--is-blockera)');
		expect(resolveThemeJsonVariableStringFromWpEditor('var:foo|bar')).toBe(
			'var:foo|bar'
		);
	});

	test('parseThemeJsonVariableToken handles preset and rejects unknown shapes', () => {
		expect(parseThemeJsonVariableToken('var:preset|color|primary')).toEqual(
			{
				kind: 'preset',
				cssVarInfix: 'color',
				slug: 'primary',
			}
		);
		expect(
			parseThemeJsonVariableToken('var(--wp--preset--color--primary)')
		).toEqual({
			kind: 'preset',
			cssVarInfix: 'color',
			slug: 'primary',
		});
		expect(parseThemeJsonVariableToken('var:preset|color|')).toBe(null);
		expect(parseThemeJsonVariableToken('var(--wp--is-blockera)')).toBe(
			null
		);
		expect(parseThemeJsonVariableToken('var:custom|x|y')).toEqual({
			kind: 'custom',
			path: ['x', 'y'],
		});
	});

	test('isThemeJsonVariableResolutionCandidateString only preset/custom tokens', () => {
		expect(
			isThemeJsonVariableResolutionCandidateString('var:preset|color|a')
		).toBe(true);
		expect(
			isThemeJsonVariableResolutionCandidateString('var:custom|a')
		).toBe(true);
		expect(
			isThemeJsonVariableResolutionCandidateString('var:foo|bar')
		).toBe(false);
		expect(
			isThemeJsonVariableResolutionCandidateString('var(--wp--x--y)')
		).toBe(false);
	});

	test('isThemeJsonVariableDefinedInMergedFeatures checks snake_case slug against merged presets', () => {
		const wrapped = wrapExperimentalFeaturesRaw(xfPaletteOnly);
		expect(
			isThemeJsonVariableDefinedInMergedFeatures(wrapped, 'primary', '')
		).toBe(true);
		expect(
			isThemeJsonVariableDefinedInMergedFeatures(
				wrapped,
				'missing_slug',
				''
			)
		).toBe(false);
		expect(
			isThemeJsonVariableDefinedInMergedFeatures(undefined, 'primary')
		).toBe(false);
		expect(
			isThemeJsonVariableDefinedInMergedFeatures(
				wrapped,
				'var:preset|color|primary',
				''
			)
		).toBe(false);
	});

	test('scoped presetCssVarInfix limits lookup bucket', () => {
		const wrapped = wrapExperimentalFeaturesRaw(xfPaletteOnly);
		expect(
			isThemeJsonVariableDefinedInMergedFeatures(
				wrapped,
				'primary',
				'',
				'color'
			)
		).toBe(true);
		expect(
			isThemeJsonVariableDefinedInMergedFeatures(
				wrapped,
				'primary',
				'',
				'spacing'
			)
		).toBe(false);
	});

	test('returns token unchanged when block editor settings are unavailable', () => {
		select.mockImplementation(() => ({
			getSettings: () => ({}),
		}));

		expect(
			resolveThemeJsonVariableStringFromWpEditor(
				'var:preset|color|primary'
			)
		).toBe('var:preset|color|primary');
	});

	test('returns token unchanged when select throws', () => {
		select.mockImplementation(() => {
			throw new Error('no store');
		});

		expect(
			resolveThemeJsonVariableStringFromWpEditor(
				'var:preset|color|primary'
			)
		).toBe('var:preset|color|primary');
	});

	test('resolves var:preset|color|slug from flat __experimentalFeatures', () => {
		select.mockImplementation(() => ({
			getSettings: () => ({
				__experimentalFeatures: xfPaletteOnly,
			}),
		}));

		expect(
			resolveThemeJsonVariableStringFromWpEditor(
				'var:preset|color|primary'
			)
		).toBe('#abc');
	});

	test('resolves CSS var(--wp--preset--color--) form', () => {
		select.mockImplementation(() => ({
			getSettings: () => ({
				__experimentalFeatures: xfPaletteOnly,
			}),
		}));

		expect(
			resolveThemeJsonVariableStringFromWpEditor(
				'var(--wp--preset--color--primary)'
			)
		).toBe('#abc');
	});

	test('uses block-level palette when blockName is passed', () => {
		select.mockImplementation(() => ({
			getSettings: () => ({
				__experimentalFeatures: {
					blocks: {
						'core/group': {
							color: {
								palette: {
									theme: [
										{
											slug: 'primary',
											color: '#111',
											name: 'Block Primary',
										},
									],
								},
							},
						},
					},
					color: {
						palette: {
							theme: [
								{
									slug: 'primary',
									color: '#abc',
									name: 'Primary',
								},
							],
						},
					},
				},
			}),
		}));

		expect(
			resolveThemeJsonVariableStringFromWpEditor(
				'var:preset|color|primary',
				'core/group'
			)
		).toBe('#111');
	});
});
