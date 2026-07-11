import { generateBlockeraSupplementalPresetVariablesCss } from '../generate-blockera-supplemental-preset-variables-css';

describe('generateBlockeraSupplementalPresetVariablesCss', () => {
	it('emits line-height preset variables from merged settings', () => {
		const css = generateBlockeraSupplementalPresetVariablesCss({
			blockera: {
				blockeraLineHeights: {
					custom: [{ slug: 'relaxed', size: '1.8', isVisible: true }],
				},
			},
		});

		expect(css).toContain('--wp--preset--line-height--relaxed: 1.8');
	});

	it('returns empty string when no supplemental presets exist', () => {
		expect(
			generateBlockeraSupplementalPresetVariablesCss({
				typography: {
					fontSizes: { theme: [{ slug: 'small', size: '14px' }] },
				},
			})
		).toBe('');
	});

	it('emits border preset variables from merged settings', () => {
		const css = generateBlockeraSupplementalPresetVariablesCss({
			blockera: {
				blockeraBorder: {
					presets: {
						custom: [
							{
								slug: 'accent',
								border: {
									width: '1px',
									style: 'solid',
									color: '#112233',
								},
							},
						],
					},
				},
			},
		});

		expect(css).toContain(
			'--wp--preset--border--accent: 1px solid #112233'
		);
	});

	it('defaults empty border style to solid in preset variables CSS', () => {
		const css = generateBlockeraSupplementalPresetVariablesCss({
			blockera: {
				blockeraBorder: {
					presets: {
						custom: [
							{
								slug: 'border-1',
								border: {
									width: '10px',
									style: '',
									color: '#d53a3a',
								},
							},
						],
					},
				},
			},
		});

		expect(css).toContain(
			'--wp--preset--border--border-1: 10px solid #d53a3a'
		);
	});
});
