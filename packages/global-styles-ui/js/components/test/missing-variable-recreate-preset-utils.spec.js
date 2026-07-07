import {
	buildMissingVariableRecreatePreset,
	normalizeMissingVariablePresetSlug,
} from '../missing-variable-recreate-preset-utils';

const customMeta = {
	isVisible: true,
	deletable: true,
	cloneable: true,
	visibilitySupport: true,
};

describe('normalizeMissingVariablePresetSlug', () => {
	it('normalizes plain slug', () => {
		expect(normalizeMissingVariablePresetSlug('my-preset')).toBe(
			'my-preset'
		);
	});

	it('strips var:preset token prefix', () => {
		expect(
			normalizeMissingVariablePresetSlug('var:preset|font-size|heading2')
		).toBe('heading-2');
	});
});

describe('buildMissingVariableRecreatePreset', () => {
	it('returns null when slug is empty', () => {
		expect(
			buildMissingVariableRecreatePreset('font-size', {
				id: '',
				name: 'Test',
				value: '16px',
			})
		).toBeNull();
	});

	it('returns null when value is empty for scalar types', () => {
		expect(
			buildMissingVariableRecreatePreset('color', {
				id: 'brand',
				name: 'Brand',
				value: '',
			})
		).toBeNull();
	});

	it('builds font-size preset', () => {
		expect(
			buildMissingVariableRecreatePreset('font-size', {
				id: 'heading-2',
				name: 'Heading 2',
				value: '24px',
				fluid: { min: '20px', max: '24px' },
			})
		).toEqual({
			slug: 'heading-2',
			name: 'Heading 2',
			size: '24px',
			fluid: { min: '20px', max: '24px' },
			...customMeta,
		});
	});

	it('builds spacing preset', () => {
		expect(
			buildMissingVariableRecreatePreset('spacing', {
				id: 'e-2-e-spacing',
				name: 'E2E Spacing',
				value: '20px',
			})
		).toEqual({
			slug: 'e-2-e-spacing',
			name: 'E2E Spacing',
			size: '20px',
			...customMeta,
		});
	});

	it('builds width-size preset', () => {
		expect(
			buildMissingVariableRecreatePreset('width-size', {
				id: 'wide',
				name: 'Wide',
				value: '1200px',
			})
		).toEqual({
			slug: 'wide',
			name: 'Wide',
			size: '1200px',
			...customMeta,
		});
	});

	it('builds color preset', () => {
		expect(
			buildMissingVariableRecreatePreset('color', {
				id: 'brand-green',
				name: 'Brand Green',
				value: '#70ca9e',
			})
		).toEqual({
			slug: 'brand-green',
			name: 'Brand Green',
			color: '#70ca9e',
			...customMeta,
		});
	});

	it('builds border-radius preset', () => {
		expect(
			buildMissingVariableRecreatePreset('border-radius', {
				id: 'round',
				name: 'Round',
				value: '8px',
			})
		).toEqual({
			slug: 'round',
			name: 'Round',
			size: '8px',
			...customMeta,
		});
	});

	it('builds linear-gradient preset', () => {
		const gradient = 'linear-gradient(90deg, #009efa 10%, #e52e00 90%)';
		expect(
			buildMissingVariableRecreatePreset('linear-gradient', {
				id: 'sunset',
				name: 'Sunset',
				value: gradient,
			})
		).toEqual({
			slug: 'sunset',
			name: 'Sunset',
			gradient,
			...customMeta,
		});
	});

	it('builds radial-gradient preset', () => {
		const gradient = 'radial-gradient(circle, #fff 0%, #000 100%)';
		expect(
			buildMissingVariableRecreatePreset('radial-gradient', {
				id: 'spot',
				name: 'Spot',
				value: gradient,
			})
		).toEqual({
			slug: 'spot',
			name: 'Spot',
			gradient,
			...customMeta,
		});
	});

	it('builds shadow preset from items CSS string', () => {
		const shadow = '10px 10px 10px 0px rgba(0,0,0,0.67)';
		const result = buildMissingVariableRecreatePreset('shadow', {
			id: 'soft',
			name: 'Soft',
			value: { items: shadow },
		});

		expect(result).toEqual(
			expect.objectContaining({
				slug: 'soft',
				name: 'Soft',
				...customMeta,
			})
		);
		expect(result?.shadow).toContain('10px');
	});

	it('builds shadow preset from serialized items array (theme.json row objects)', () => {
		const result = buildMissingVariableRecreatePreset('shadow', {
			id: 'soft',
			name: 'Soft',
			value: {
				items: [
					{
						type: 'outer',
						x: '10px',
						y: '10px',
						blur: '10px',
						spread: '0px',
						color: 'rgba(0,0,0,0.67)',
						isVisible: true,
					},
				],
			},
		});

		expect(result).toEqual({
			slug: 'soft',
			name: 'Soft',
			shadow: '10px 10px 10px 0px rgba(0,0,0,0.67)',
			...customMeta,
		});
	});

	it('builds shadow preset from box-shadow repeater record', () => {
		const result = buildMissingVariableRecreatePreset('shadow', {
			id: 'lift',
			name: 'Lift',
			value: {
				'outer-0': {
					type: 'outer',
					x: '5px',
					y: '5px',
					blur: '5px',
					spread: '0px',
					color: '#ff0000',
					isVisible: true,
					order: 0,
				},
			},
		});

		expect(result?.shadow).toContain('5px');
		expect(result?.shadow).toContain('#ff0000');
	});

	it('builds text-shadow preset from CSS string', () => {
		const shadow = '2px 2px 4px #000000';
		expect(
			buildMissingVariableRecreatePreset('text-shadow', {
				id: 'lift',
				name: 'Lift',
				value: shadow,
			})
		).toEqual({
			slug: 'lift',
			name: 'Lift',
			shadow,
			...customMeta,
		});
	});

	it('builds text-shadow preset from repeater record', () => {
		const result = buildMissingVariableRecreatePreset('text-shadow', {
			id: 'glow',
			name: 'Glow',
			value: {
				0: {
					x: '2px',
					y: '3px',
					blur: '4px',
					color: '#00ff00',
					isVisible: true,
					order: 0,
				},
			},
		});

		expect(result?.shadow).toContain('2px');
		expect(result?.shadow).toContain('#00ff00');
	});

	it('builds transform preset from serialized items array', () => {
		expect(
			buildMissingVariableRecreatePreset('transform', {
				id: 'shift',
				name: 'Shift',
				value: {
					items: [
						{
							type: 'move',
							'move-x': '15px',
							'move-y': '4px',
							'move-z': '0px',
							isVisible: true,
						},
					],
				},
			})
		).toEqual({
			slug: 'shift',
			name: 'Shift',
			items: [
				{
					type: 'move',
					'move-x': '15px',
					'move-y': '4px',
					'move-z': '0px',
					isVisible: true,
				},
			],
			...customMeta,
		});
	});

	it('builds transform preset from repeater record', () => {
		expect(
			buildMissingVariableRecreatePreset('transform', {
				id: 'shift',
				name: 'Shift',
				value: {
					'move-0': {
						type: 'move',
						'move-x': '12px',
						'move-y': '4px',
						'move-z': '0px',
						isVisible: true,
						order: 0,
					},
				},
			})
		).toEqual({
			slug: 'shift',
			name: 'Shift',
			items: [
				{
					type: 'move',
					'move-x': '12px',
					'move-y': '4px',
					'move-z': '0px',
					isVisible: true,
				},
			],
			...customMeta,
		});
	});

	it('builds transition preset from serialized items array', () => {
		expect(
			buildMissingVariableRecreatePreset('transition', {
				id: 'fade',
				name: 'Fade',
				value: {
					items: [
						{
							type: 'opacity',
							duration: '300ms',
							timing: 'linear',
							delay: '50ms',
							isVisible: true,
						},
					],
				},
			})
		).toEqual({
			slug: 'fade',
			name: 'Fade',
			items: [
				{
					type: 'opacity',
					duration: '300ms',
					timing: 'linear',
					delay: '50ms',
				},
			],
			...customMeta,
		});
	});

	it('builds filter preset from serialized items array', () => {
		expect(
			buildMissingVariableRecreatePreset('filter', {
				id: 'blur',
				name: 'Blur',
				value: {
					items: [{ type: 'blur', blur: '6px', isVisible: true }],
				},
			})
		).toEqual({
			slug: 'blur',
			name: 'Blur',
			items: [{ type: 'blur', blur: '6px', isVisible: true }],
			...customMeta,
		});
	});

	it('builds border preset from flat side object', () => {
		const border = { width: '1px', style: 'solid', color: '#000000' };
		expect(
			buildMissingVariableRecreatePreset('border', {
				id: 'frame',
				name: 'Frame',
				value: border,
			})
		).toEqual({
			slug: 'frame',
			name: 'Frame',
			border,
			...customMeta,
		});
	});

	it('builds border preset from border box control value', () => {
		expect(
			buildMissingVariableRecreatePreset('border', {
				id: 'frame',
				name: 'Frame',
				value: {
					type: 'all',
					all: {
						width: '2px',
						style: 'solid',
						color: '#112233',
					},
				},
			})
		).toEqual({
			slug: 'frame',
			name: 'Frame',
			border: {
				width: '2px',
				style: 'solid',
				color: '#112233',
			},
			...customMeta,
		});
	});

	it('returns null for border box value with empty sides', () => {
		expect(
			buildMissingVariableRecreatePreset('border', {
				id: 'empty',
				name: 'Empty',
				value: {
					type: 'all',
					all: { width: '', style: '', color: '' },
				},
			})
		).toBeNull();
	});
});

describe('buildMissingVariableRecreatePreset — serialize round-trip', () => {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const { serializeGlobalStylePresetItemValue } = require('@blockera/data');

	it('recreates shadow preset from serializeGlobalStylePresetItemValue payload', () => {
		const presetRow = {
			slug: 'e-2-e-shadow',
			name: 'E2E Shadow',
			items: [
				{
					type: 'outer',
					x: '8px',
					y: '8px',
					blur: '8px',
					spread: '0px',
					color: '#000000ab',
					isVisible: true,
				},
			],
		};
		const cachedValue = serializeGlobalStylePresetItemValue(
			presetRow,
			'shadow'
		);
		const result = buildMissingVariableRecreatePreset('shadow', {
			id: 'e-2-e-shadow',
			name: 'E2E Shadow',
			value: cachedValue,
		});

		expect(result?.shadow).toContain('8px');
		expect(result?.shadow).toContain('#000000ab');
	});

	it('recreates transform preset from serializeGlobalStylePresetItemValue payload', () => {
		const presetRow = {
			slug: 'e-2-e-transform',
			name: 'E2E Transform',
			items: [
				{
					type: 'move',
					'move-x': '10px',
					'move-y': '0px',
					'move-z': '0px',
					isVisible: true,
				},
			],
		};
		const cachedValue = serializeGlobalStylePresetItemValue(
			presetRow,
			'transform'
		);
		const result = buildMissingVariableRecreatePreset('transform', {
			id: 'e-2-e-transform',
			name: 'E2E Transform',
			value: cachedValue,
		});

		expect(result?.items).toEqual(presetRow.items);
	});
});

describe('recreateMissingVariablePreset', () => {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const {
		recreateMissingVariablePreset,
	} = require('../recreate-missing-variable-preset');

	it('appends custom font-size preset', () => {
		let config = {
			settings: { typography: { fontSizes: { custom: [] } } },
		};
		const result = recreateMissingVariablePreset({
			variableType: 'font-size',
			settings: { id: 'hero', name: 'Hero', value: '32px' },
			getUserConfig: () => config,
			setUserConfig: (updater) => {
				config = updater(config);
			},
		});

		expect(result).toEqual({ ok: true, slug: 'hero' });
		expect(config.settings.typography.fontSizes.custom).toEqual([
			expect.objectContaining({ slug: 'hero', size: '32px' }),
		]);
	});

	it('returns duplicate when slug already exists', () => {
		const config = {
			settings: {
				color: {
					palette: {
						custom: [
							{ slug: 'brand', name: 'Brand', color: '#000' },
						],
					},
				},
			},
		};

		expect(
			recreateMissingVariablePreset({
				variableType: 'color',
				settings: { id: 'brand', name: 'Brand', value: '#fff' },
				getUserConfig: () => config,
				setUserConfig: () => {},
			})
		).toEqual({ ok: false, reason: 'duplicate' });
	});
});
