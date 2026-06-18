import {
	buildPresetWithDescriptionUpdate,
	getPresetDescription,
	getPresetMetaRecord,
	withPresetMetaFromRepeaterRow,
} from '../preset-meta-utils';

describe('preset-meta-utils', () => {
	it('reads description from meta', () => {
		expect(
			getPresetDescription({
				slug: 'a',
				name: 'A',
				meta: { description: 'Hello' },
			})
		).toBe('Hello');
	});

	it('returns empty string when meta or description is missing', () => {
		expect(getPresetDescription({ slug: 'a', name: 'A' })).toBe('');
		expect(
			getPresetDescription({
				slug: 'a',
				name: 'A',
				meta: { 'interface-size': 'small' },
			})
		).toBe('');
	});

	it('getPresetMetaRecord ignores non-object meta', () => {
		expect(getPresetMetaRecord({ slug: 'a', name: 'A', meta: null })).toBe(
			undefined
		);
		expect(getPresetMetaRecord({ slug: 'a', name: 'A', meta: ['x'] })).toBe(
			undefined
		);
	});

	it('withPresetMetaFromRepeaterRow copies meta onto persisted fields', () => {
		expect(
			withPresetMetaFromRepeaterRow(
				{
					slug: 'x',
					meta: { description: 'D', 'interface-size': 'small' },
				},
				{ slug: 'x', name: 'X', color: '#000' }
			)
		).toEqual({
			slug: 'x',
			name: 'X',
			color: '#000',
			meta: { description: 'D', 'interface-size': 'small' },
		});
	});

	it('withPresetMetaFromRepeaterRow omits meta when absent', () => {
		expect(
			withPresetMetaFromRepeaterRow(
				{ slug: 'x' },
				{ slug: 'x', name: 'X' }
			)
		).toEqual({ slug: 'x', name: 'X' });
	});

	it('buildPresetWithDescriptionUpdate sets description and preserves other meta keys', () => {
		const base = {
			slug: 'x',
			name: 'X',
			meta: { 'interface-size': 'small', description: 'Old' },
		};
		expect(buildPresetWithDescriptionUpdate(base, 'New text')).toEqual({
			slug: 'x',
			name: 'X',
			meta: { 'interface-size': 'small', description: 'New text' },
		});
	});

	it('buildPresetWithDescriptionUpdate removes meta when description cleared and no other keys', () => {
		const base = {
			slug: 'x',
			name: 'X',
			meta: { description: 'Old' },
		};
		expect(buildPresetWithDescriptionUpdate(base, '')).toEqual({
			slug: 'x',
			name: 'X',
		});
	});

	it('buildPresetWithDescriptionUpdate keeps meta when description cleared but other keys remain', () => {
		const base = {
			slug: 'x',
			name: 'X',
			meta: { description: 'Old', 'interface-size': 'small' },
		};
		expect(buildPresetWithDescriptionUpdate(base, '')).toEqual({
			slug: 'x',
			name: 'X',
			meta: { 'interface-size': 'small' },
		});
	});
});
