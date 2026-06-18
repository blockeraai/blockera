import {
	parsePresetNameTaxonomy,
	slugifyTaxonomySegment,
	splitPresetNameTaxonomySegments,
	isNameBasedTaxonomyPreset,
} from '../parse-preset-name-taxonomy';
import {
	buildTaxonomyTree,
	partitionPresetsForTaxonomyUi,
} from '../partition-and-tree';
import {
	resolvePresetTaxonomyDisplayName,
	resolvePresetTaxonomyEditName,
} from '../taxonomy-meta';
import { isPresetTaxonomyInterfaceSizeSmall } from '../../preset-taxonomy-ui/preset-taxonomy-utils';
import {
	getThemeTaxonomyBasePalette,
	getThemeTaxonomyPrimaryCategoryPalette,
	getThemeTaxonomyStatusPromotionPalette,
	getThemeTaxonomyTextPalette,
	getThemeTaxonomyUserPalette,
} from './fixtures/twentytwentyfive-color-taxonomy-fixture';

describe('parse-preset-name-taxonomy', () => {
	it('treats spaced and unspaced slash forms as equivalent', () => {
		expect(splitPresetNameTaxonomySegments('Design System/White')).toEqual([
			'Design System',
			'White',
		]);
		expect(
			splitPresetNameTaxonomySegments('Design System / White')
		).toEqual(['Design System', 'White']);
	});

	it('maps 2/3/4+ segments to group/category/sub/leaf', () => {
		expect(parsePresetNameTaxonomy('Design System/Primary')).toEqual({
			groupName: 'Design System',
			leafName: 'Primary',
		});
		expect(parsePresetNameTaxonomy('Status/Success/Border')).toEqual({
			groupName: 'Status',
			categoryName: 'Success',
			leafName: 'Border',
		});
		expect(
			parsePresetNameTaxonomy('Design System/Text/Primary/Color')
		).toEqual({
			groupName: 'Design System',
			categoryName: 'Text',
			subCategoryName: 'Primary',
			leafName: 'Color',
		});
	});

	it('slugifyTaxonomySegment normalizes labels for stable keys', () => {
		expect(slugifyTaxonomySegment('Design System')).toBe('design-system');
		expect(slugifyTaxonomySegment(' On Brand ')).toBe('on-brand');
	});

	it('excludes shade slugs and renderRepeaterItem false from taxonomy', () => {
		expect(
			isNameBasedTaxonomyPreset({
				name: 'Design System/Neutral/Shade 50',
				slug: 'neutral-shade-50',
				color: '#000',
			})
		).toBe(false);
		expect(
			isNameBasedTaxonomyPreset({
				name: 'Hidden/Row',
				slug: 'hidden-row',
				color: '#000',
				meta: { renderRepeaterItem: false },
			})
		).toBe(false);
		expect(
			isNameBasedTaxonomyPreset({
				name: 'Design System/Primary',
				slug: 'primary',
				color: '#000',
			})
		).toBe(true);
	});
});

describe('partition-and-tree', () => {
	it('partitions flat vs taxonomy presets', () => {
		const presets = [
			{ slug: 'base', name: 'Base', color: '#fff' },
			{
				slug: 'primary',
				name: 'Design System/Primary',
				color: '#f00',
			},
		];
		const { taxonomyPresets, simplePresets, taxonomySlugSet } =
			partitionPresetsForTaxonomyUi(presets);
		expect(taxonomyPresets).toHaveLength(1);
		expect(taxonomySlugSet.has('primary')).toBe(true);
		expect(simplePresets).toHaveLength(1);
		expect(simplePresets[0].slug).toBe('base');
	});

	it('builds nested tree and merges mixed spacing into one group', () => {
		const presets = [
			{
				slug: 'a',
				name: 'Group A / Leaf A',
				color: '#111',
			},
			{
				slug: 'b',
				name: 'Group A/Cat B/Leaf B',
				color: '#222',
			},
			{
				slug: 'c',
				name: 'Group A/Cat B/Sub C/Leaf C',
				color: '#333',
			},
		];
		const tree = buildTaxonomyTree(presets);
		expect(tree).toHaveLength(1);
		expect(tree[0].name).toBe('Group A');
		expect(tree[0].directPresets).toHaveLength(1);
		expect(tree[0].directPresets[0].slug).toBe('a');
		expect(tree[0].categories).toHaveLength(1);
		expect(tree[0].categories[0].name).toBe('Cat B');
		expect(tree[0].categories[0].directPresets[0].slug).toBe('b');
		expect(tree[0].categories[0].subSections[0].presets[0].slug).toBe('c');
	});

	it('partitions flat user labels using base theme slash names by slug', () => {
		const presets = [
			{ slug: 'primary', name: 'Primary', color: '#f00' },
			{ slug: 'base', name: 'Base', color: '#fff' },
		];
		const basePresets = [
			{ slug: 'primary', name: 'Design System/Primary', color: '#f00' },
		];
		const { taxonomyPresets, taxonomySlugSet } =
			partitionPresetsForTaxonomyUi(presets, basePresets);
		expect(taxonomyPresets).toHaveLength(1);
		expect(taxonomySlugSet.has('primary')).toBe(true);
		const tree = buildTaxonomyTree(taxonomyPresets, presets, basePresets);
		expect(tree[0].name).toBe('Design System');
		expect(tree[0].directPresets[0].slug).toBe('primary');
	});

	it('nests a 2-segment preset into a category when deeper paths share the middle segment', () => {
		const presets = getThemeTaxonomyStatusPromotionPalette();
		const { taxonomyPresets } = partitionPresetsForTaxonomyUi(presets);
		const tree = buildTaxonomyTree(taxonomyPresets, presets);
		expect(tree).toHaveLength(1);
		expect(tree[0].name).toBe('Status');
		expect(tree[0].directPresets.map((p) => p.slug)).toEqual(['error']);
		expect(tree[0].categories).toHaveLength(1);
		expect(tree[0].categories[0].name).toBe('Success');
		expect(tree[0].categories[0].directPresets.map((p) => p.slug)).toEqual([
			'success',
			'success-border',
		]);
		expect(tree[0].categories[0].childOrder).toEqual([
			{ kind: 'preset', slug: 'success' },
			{ kind: 'preset', slug: 'success-border' },
		]);
		expect(tree[0].childOrder).toEqual([
			{ kind: 'category', slug: 'success' },
			{ kind: 'preset', slug: 'error' },
		]);
	});

	it('preserves palette order when interleaving direct presets and categories', () => {
		const presets = getThemeTaxonomyTextPalette();
		const { taxonomyPresets } = partitionPresetsForTaxonomyUi(presets);
		const tree = buildTaxonomyTree(taxonomyPresets, presets);
		expect(tree).toHaveLength(1);
		expect(tree[0].name).toBe('Text');
		expect(tree[0].childOrder).toEqual([
			{ kind: 'category', slug: 'primary' },
			{ kind: 'preset', slug: 'text-placeholder' },
			{ kind: 'preset', slug: 'text-white' },
			{ kind: 'preset', slug: 'text-black' },
		]);
	});

	it('nests flat labels into a category using base theme slash names by slug', () => {
		const presets = [
			{ slug: 'success', name: 'Success', color: '#0f0' },
			{ slug: 'success-border', name: 'Success - Border', color: '#0ff' },
		];
		const basePresets = [
			{ slug: 'success', name: 'Status/Success', color: '#0f0' },
			{
				slug: 'success-border',
				name: 'Status/Success/Border',
				color: '#0ff',
			},
		];
		const { taxonomyPresets } = partitionPresetsForTaxonomyUi(
			presets,
			basePresets
		);
		const tree = buildTaxonomyTree(taxonomyPresets, presets, basePresets);
		expect(tree[0].directPresets).toHaveLength(0);
		expect(tree[0].categories[0].directPresets.map((p) => p.slug)).toEqual([
			'success',
			'success-border',
		]);
		expect(tree[0].categories[0].childOrder).toEqual([
			{ kind: 'preset', slug: 'success' },
			{ kind: 'preset', slug: 'success-border' },
		]);
	});

	it('resolvePresetTaxonomyDisplayName uses leaf segment from slash-delimited name', () => {
		expect(
			resolvePresetTaxonomyDisplayName({
				name: 'Design System/Text/Primary/Color',
			})
		).toBe('Color');
		expect(
			resolvePresetTaxonomyDisplayName({
				name: 'Status/Success/Border',
			})
		).toBe('Border');
	});

	it('resolvePresetTaxonomyEditName returns full slash path for taxonomy edit form', () => {
		const basePalette = getThemeTaxonomyBasePalette();
		const source = {
			basePresetsBySlug: new Map(
				basePalette.map((row) => [row.slug, row])
			),
		};
		expect(
			resolvePresetTaxonomyEditName(
				{
					slug: 'text-primary_on-brand',
					name: 'Text - Primary - On Brand',
				},
				source
			)
		).toBe('Text / Primary / On Brand');
	});

	it('resolvePresetTaxonomyDisplayName uses base theme slash name when user row is flat', () => {
		const basePalette = getThemeTaxonomyBasePalette();
		const source = {
			basePresetsBySlug: new Map(
				basePalette.map((row) => [row.slug, row])
			),
		};
		expect(
			resolvePresetTaxonomyDisplayName(
				{
					slug: 'text-placeholder',
					name: 'Text - Placeholder',
				},
				source
			)
		).toBe('Placeholder');
	});

	it('partitions spacing presets with slash-delimited names (Base / Tiny)', () => {
		const presets = [
			{
				slug: 'e2e-base-tiny',
				name: 'Base / Tiny',
				size: '10px',
			},
			{
				slug: 'regular',
				name: 'Regular',
				size: '20px',
			},
		];
		const { taxonomyPresets, simplePresets, taxonomySlugSet } =
			partitionPresetsForTaxonomyUi(presets);
		expect(taxonomyPresets.map((p) => p.slug)).toEqual(['e2e-base-tiny']);
		expect(simplePresets.map((p) => p.slug)).toEqual(['regular']);
		expect(taxonomySlugSet.has('e2e-base-tiny')).toBe(true);
		const tree = buildTaxonomyTree(taxonomyPresets, presets);
		expect(tree[0].name).toBe('Base');
		expect(tree[0].directPresets[0].name).toBe('Base / Tiny');
		expect(
			resolvePresetTaxonomyDisplayName({
				slug: 'e2e-base-tiny',
				name: 'Base / Tiny',
			})
		).toBe('Tiny');
	});

	it('merges base theme meta so interface-size small applies when user row omits meta', () => {
		const basePresets = getThemeTaxonomyPrimaryCategoryPalette();
		const presets = basePresets.map((row) => {
			const { meta, ...rest } = row;
			return rest;
		});
		const { taxonomyPresets } = partitionPresetsForTaxonomyUi(
			presets,
			basePresets
		);
		const tree = buildTaxonomyTree(taxonomyPresets, presets, basePresets);
		const primaryCategory = tree[0].categories.find(
			(c) => c.slug === 'primary'
		);
		expect(primaryCategory?.directPresets.map((p) => p.slug)).toEqual([
			'text-primary',
			'text-primary_on-brand',
		]);
		for (const preset of primaryCategory?.directPresets ?? []) {
			expect(isPresetTaxonomyInterfaceSizeSmall(preset)).toBe(true);
		}
	});

	it('builds taxonomy tree from frozen twentytwentyfive theme palette fixture', () => {
		const basePresets = getThemeTaxonomyBasePalette();
		const userPresets = getThemeTaxonomyUserPalette();
		const { taxonomyPresets } = partitionPresetsForTaxonomyUi(
			userPresets,
			basePresets
		);
		const tree = buildTaxonomyTree(
			taxonomyPresets,
			userPresets,
			basePresets
		);

		expect(tree.map((group) => group.name)).toEqual([
			'Base',
			'Text',
			'Status',
		]);

		const baseGroup = tree[0];
		expect(baseGroup.directPresets.map((p) => p.slug)).toEqual([
			'primary',
			'neutral',
			'white',
			'black',
		]);

		const textGroup = tree[1];
		expect(textGroup.childOrder).toEqual([
			{ kind: 'category', slug: 'primary' },
			{ kind: 'preset', slug: 'text-placeholder' },
			{ kind: 'preset', slug: 'text-white' },
			{ kind: 'preset', slug: 'text-black' },
		]);
		const primaryCategory = textGroup.categories.find(
			(c) => c.slug === 'primary'
		);
		expect(primaryCategory?.directPresets.map((p) => p.slug)).toEqual([
			'text-primary',
			'text-primary_on-brand',
		]);
		for (const preset of primaryCategory?.directPresets ?? []) {
			expect(isPresetTaxonomyInterfaceSizeSmall(preset)).toBe(true);
		}

		const statusGroup = tree[2];
		expect(statusGroup.directPresets.map((p) => p.slug)).toEqual([
			'error',
			'warning',
			'info',
		]);
		const successCategory = statusGroup.categories.find(
			(c) => c.slug === 'success'
		);
		expect(successCategory?.directPresets.map((p) => p.slug)).toEqual([
			'success',
			'success-border',
		]);
	});
});
