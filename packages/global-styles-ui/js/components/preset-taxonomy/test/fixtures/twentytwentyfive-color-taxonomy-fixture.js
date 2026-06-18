/**
 * Frozen taxonomy palette from twentytwentyfive theme.json for unit tests.
 *
 * @see ./twentytwentyfive-color-taxonomy-palette.fixture.json
 * @see wp-content/themes/twentytwentyfive/theme.json (settings.color.palette)
 */
import themeTaxonomyFixture from './twentytwentyfive-color-taxonomy-palette.fixture.json';

const basePalette = themeTaxonomyFixture.palette;

/** Base theme rows as authored in theme.json (includes meta). */
export function getThemeTaxonomyBasePalette() {
	return basePalette.map((row) => ({ ...row }));
}

/** Site Editor user palette: same rows without meta (meta is dropped on round-trip). */
export function getThemeTaxonomyUserPalette() {
	return basePalette.map((row) => {
		const { meta, ...rest } = row;
		return rest;
	});
}

export function getThemeTaxonomyPaletteBySlugs(slugs) {
	const slugSet = new Set(slugs);
	return basePalette.filter((row) => slugSet.has(row.slug));
}

export function getThemeTaxonomyTextPalette() {
	return getThemeTaxonomyPaletteBySlugs([
		'text-primary',
		'text-primary_on-brand',
		'text-placeholder',
		'text-white',
		'text-black',
	]);
}

export function getThemeTaxonomyStatusPromotionPalette() {
	return getThemeTaxonomyPaletteBySlugs([
		'success',
		'success-border',
		'error',
	]);
}

export function getThemeTaxonomyPrimaryCategoryPalette() {
	return getThemeTaxonomyPaletteBySlugs([
		'text-primary',
		'text-primary_on-brand',
	]);
}
