import {
	globalStylePresetSerializedValueToCss,
	resolveThemeJsonPresetCssDeclarationValue,
} from '../theme-json-preset-css-declaration-value';

describe('resolveThemeJsonPresetCssDeclarationValue', () => {
	it('normalizes line-height preset size', () => {
		expect(
			resolveThemeJsonPresetCssDeclarationValue(
				{ slug: 'relaxed', size: '.9rem', isVisible: true },
				'line-height'
			)
		).toBe('0.9rem');
	});

	it('resolves border preset shorthand', () => {
		expect(
			resolveThemeJsonPresetCssDeclarationValue(
				{
					slug: 'accent',
					border: { width: '2px', style: 'solid', color: '#336699' },
				},
				'border'
			)
		).toBe('2px solid #336699');
	});

	it('defaults empty border style to solid when width and color are set', () => {
		expect(
			resolveThemeJsonPresetCssDeclarationValue(
				{
					slug: 'border-1',
					border: { width: '10px', style: '', color: '#d53a3a' },
				},
				'border'
			)
		).toBe('10px solid #d53a3a');
	});

	it('prefers canonical text-shadow string', () => {
		expect(
			resolveThemeJsonPresetCssDeclarationValue(
				{ slug: 'soft', shadow: '1px 1px 2px #000' },
				'text-shadow'
			)
		).toBe('1px 1px 2px #000');
	});

	it('skips hidden presets', () => {
		expect(
			resolveThemeJsonPresetCssDeclarationValue(
				{ slug: 'hidden', size: '1.5', isVisible: false },
				'line-height'
			)
		).toBe('');
	});
});

describe('globalStylePresetSerializedValueToCss', () => {
	it('serializes transition repeater rows', () => {
		expect(
			globalStylePresetSerializedValueToCss(
				{
					items: [
						{
							type: 'opacity',
							duration: '300ms',
							timing: 'ease',
							delay: '0ms',
							isVisible: true,
						},
					],
				},
				'transition'
			)
		).toBe('opacity 300ms ease 0ms');
	});
});
