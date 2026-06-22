import { resolveVariablePickerCustomAddPresetValue } from '../variable-picker-custom-add-preset-utils';
import {
	mergeVariablePickerCreatingStepIntoItems,
	syncVariablePickerCreatingStepSlugs,
} from '../variable-picker-preset-utils';

const baseDefault = {
	slug: 'custom-1',
	name: 'Custom 1',
	isVisible: true,
};

describe('resolveVariablePickerCustomAddPresetValue', () => {
	describe('skip seeding', () => {
		it('returns static default when rawValue is empty', () => {
			const defaults = { ...baseDefault, size: '16px' };
			expect(
				resolveVariablePickerCustomAddPresetValue({
					rawValue: '',
					variableType: 'font-size',
					defaultPresetValue: defaults,
				})
			).toEqual(defaults);
		});

		it('returns static default when rawValue is undefined', () => {
			const defaults = { ...baseDefault, size: '16px' };
			expect(
				resolveVariablePickerCustomAddPresetValue({
					rawValue: undefined,
					variableType: 'font-size',
					defaultPresetValue: defaults,
				})
			).toEqual(defaults);
		});

		it('returns static default for variable addon', () => {
			const defaults = { ...baseDefault, size: '16px' };
			expect(
				resolveVariablePickerCustomAddPresetValue({
					rawValue: {
						isValueAddon: true,
						valueType: 'variable',
						settings: { type: 'font-size', id: 'small' },
					},
					variableType: 'font-size',
					defaultPresetValue: defaults,
				})
			).toEqual(defaults);
		});

		it('returns static default for dynamic-value addon', () => {
			const defaults = { ...baseDefault, size: '16px' };
			expect(
				resolveVariablePickerCustomAddPresetValue({
					rawValue: {
						isValueAddon: true,
						valueType: 'dynamic-value',
						settings: { group: 'post', name: 'title' },
					},
					variableType: 'font-size',
					defaultPresetValue: defaults,
				})
			).toEqual(defaults);
		});

		it('returns static default for plain theme.json preset slug string', () => {
			const defaults = { ...baseDefault, color: '#000000' };
			expect(
				resolveVariablePickerCustomAddPresetValue({
					rawValue: 'vivid-purple',
					variableType: 'color',
					defaultPresetValue: defaults,
				})
			).toEqual(defaults);
		});
	});

	describe('scalar types', () => {
		it('seeds font-size from scalar', () => {
			const defaults = { ...baseDefault, size: '16px' };
			expect(
				resolveVariablePickerCustomAddPresetValue({
					rawValue: '24px',
					variableType: 'font-size',
					defaultPresetValue: defaults,
				})
			).toEqual({ ...defaults, size: '24px' });
		});

		it('seeds spacing from scalar', () => {
			const defaults = { ...baseDefault, size: '20px' };
			expect(
				resolveVariablePickerCustomAddPresetValue({
					rawValue: '10px',
					variableType: 'spacing',
					defaultPresetValue: defaults,
				})
			).toEqual({ ...defaults, size: '10px' });
		});

		it('seeds width-size from scalar', () => {
			const defaults = { ...baseDefault, size: '640px' };
			expect(
				resolveVariablePickerCustomAddPresetValue({
					rawValue: '120px',
					variableType: 'width-size',
					defaultPresetValue: defaults,
				})
			).toEqual({ ...defaults, size: '120px' });
		});

		it('seeds color from scalar', () => {
			const defaults = { ...baseDefault, color: '#000000' };
			expect(
				resolveVariablePickerCustomAddPresetValue({
					rawValue: '#70ca9e',
					variableType: 'color',
					defaultPresetValue: defaults,
				})
			).toEqual({ ...defaults, color: '#70ca9e' });
		});

		it('seeds border-radius from scalar', () => {
			const defaults = { ...baseDefault, size: '4px' };
			expect(
				resolveVariablePickerCustomAddPresetValue({
					rawValue: '8px',
					variableType: 'border-radius',
					defaultPresetValue: defaults,
				})
			).toEqual({ ...defaults, size: '8px' });
		});
	});

	describe('gradient types', () => {
		it('seeds linear-gradient from CSS string', () => {
			const gradient = 'linear-gradient(90deg, #009efa 10%, #e52e00 90%)';
			const defaults = {
				...baseDefault,
				gradient: 'linear-gradient(90deg,#000 0%,#fff 100%)',
			};
			expect(
				resolveVariablePickerCustomAddPresetValue({
					rawValue: gradient,
					variableType: 'linear-gradient',
					defaultPresetValue: defaults,
				})
			).toEqual({ ...defaults, gradient });
		});

		it('seeds radial-gradient from CSS string', () => {
			const gradient =
				'radial-gradient(circle, #009efa 0%, #e52e00 100%)';
			const defaults = {
				...baseDefault,
				gradient: 'radial-gradient(circle, #000 0%, #fff 100%)',
			};
			expect(
				resolveVariablePickerCustomAddPresetValue({
					rawValue: gradient,
					variableType: 'radial-gradient',
					defaultPresetValue: defaults,
				})
			).toEqual({ ...defaults, gradient });
		});
	});

	describe('structured repeater types', () => {
		it('seeds transform items from repeater record', () => {
			const defaults = {
				...baseDefault,
				items: [
					{
						type: 'move',
						'move-x': '0px',
						'move-y': '0px',
						'move-z': '0px',
						isVisible: true,
					},
				],
			};
			const result = resolveVariablePickerCustomAddPresetValue({
				rawValue: {
					'move-0': {
						type: 'move',
						'move-x': '12px',
						'move-y': '4px',
						'move-z': '0px',
						isVisible: true,
						order: 0,
					},
				},
				variableType: 'transform',
				defaultPresetValue: defaults,
			});

			expect(result.items).toEqual([
				{
					type: 'move',
					'move-x': '12px',
					'move-y': '4px',
					'move-z': '0px',
					isVisible: true,
				},
			]);
		});

		it('seeds filter items from repeater record', () => {
			const defaults = {
				...baseDefault,
				items: [{ type: 'blur', blur: '3px', isVisible: true }],
			};
			const result = resolveVariablePickerCustomAddPresetValue({
				rawValue: {
					'blur-0': {
						type: 'blur',
						blur: '6px',
						isVisible: true,
						order: 0,
					},
				},
				variableType: 'filter',
				defaultPresetValue: defaults,
			});

			expect(result.items).toEqual([
				{ type: 'blur', blur: '6px', isVisible: true },
			]);
		});

		it('seeds transition items from repeater record', () => {
			const defaults = {
				...baseDefault,
				items: [
					{
						type: 'all',
						duration: '500ms',
						timing: 'ease',
						delay: '0ms',
						isVisible: true,
					},
				],
			};
			const result = resolveVariablePickerCustomAddPresetValue({
				rawValue: {
					'all-0': {
						type: 'opacity',
						duration: '300ms',
						timing: 'linear',
						delay: '50ms',
						isVisible: true,
						order: 0,
					},
				},
				variableType: 'transition',
				defaultPresetValue: defaults,
			});

			expect(result.items).toEqual([
				{
					type: 'opacity',
					duration: '300ms',
					timing: 'linear',
					delay: '50ms',
				},
			]);
		});

		it('seeds shadow CSS from box-shadow repeater', () => {
			const defaults = {
				...baseDefault,
				shadow: '10px 10px 10px 0px #000000ab',
			};
			const result = resolveVariablePickerCustomAddPresetValue({
				rawValue: {
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
				variableType: 'shadow',
				defaultPresetValue: defaults,
			});

			expect(result.shadow).toContain('5px');
			expect(result.shadow).toContain('#ff0000');
		});

		it('seeds text-shadow CSS from repeater', () => {
			const defaults = {
				...baseDefault,
				shadow: '1px 1px 1px #000000ab',
			};
			const result = resolveVariablePickerCustomAddPresetValue({
				rawValue: {
					0: {
						x: '2px',
						y: '3px',
						blur: '4px',
						color: '#00ff00',
						isVisible: true,
						order: 0,
					},
				},
				variableType: 'text-shadow',
				defaultPresetValue: defaults,
			});

			expect(result.shadow).toContain('2px');
			expect(result.shadow).toContain('#00ff00');
		});

		it('seeds border from border control value', () => {
			const defaults = {
				...baseDefault,
				border: { width: '', style: '', color: '' },
			};
			const result = resolveVariablePickerCustomAddPresetValue({
				rawValue: {
					width: '2px',
					style: 'solid',
					color: '#112233',
				},
				variableType: 'border',
				defaultPresetValue: defaults,
			});

			expect(result.border).toEqual({
				width: '2px',
				style: 'solid',
				color: '#112233',
			});
		});

		it('returns static default when repeater record is empty', () => {
			const defaults = {
				...baseDefault,
				items: [
					{
						type: 'move',
						'move-x': '0px',
						'move-y': '0px',
						'move-z': '0px',
						isVisible: true,
					},
				],
			};
			expect(
				resolveVariablePickerCustomAddPresetValue({
					rawValue: {},
					variableType: 'transform',
					defaultPresetValue: defaults,
				})
			).toEqual(defaults);
		});
	});
});

describe('variable picker creatingStep slug helpers', () => {
	it('syncVariablePickerCreatingStepSlugs tracks and clears slugs', () => {
		let slugs = syncVariablePickerCreatingStepSlugs(
			{},
			{
				'font-size-1': { slug: 'font-size-1', creatingStep: true },
			}
		);
		expect(slugs).toEqual({ 'font-size-1': true });

		slugs = syncVariablePickerCreatingStepSlugs(slugs, {
			'font-size-1': { slug: 'font-size-1', creatingStep: false },
		});
		expect(slugs).toEqual({});
	});

	it('syncVariablePickerCreatingStepSlugs drops stale slug when derived slug changes during create', () => {
		let slugs = syncVariablePickerCreatingStepSlugs(
			{},
			{
				0: { slug: 'transform-1', creatingStep: true },
			}
		);
		expect(slugs).toEqual({ 'transform-1': true });

		slugs = syncVariablePickerCreatingStepSlugs(slugs, {
			0: { slug: 'e-2-e-transform', creatingStep: true },
		});
		expect(slugs).toEqual({ 'e-2-e-transform': true });
	});

	it('syncVariablePickerCreatingStepSlugs keeps mid-create slug after persist strips creatingStep', () => {
		const slugs = syncVariablePickerCreatingStepSlugs(
			{ 'e-2-e-transform': true },
			{
				0: { slug: 'e-2-e-transform', name: 'E2E Transform' },
			}
		);
		expect(slugs).toEqual({ 'e-2-e-transform': true });
	});

	it('mergeVariablePickerCreatingStepIntoItems restores creatingStep on array rows', () => {
		const items = [{ slug: 'font-size-2', size: '20px' }];
		const merged = mergeVariablePickerCreatingStepIntoItems(items, {
			'font-size-2': true,
		});
		expect(merged[0].creatingStep).toBe(true);
	});
});
