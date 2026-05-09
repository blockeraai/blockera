/**
 * Merges an updated simple-origin repeater subset back into the full palette while keeping
 * taxonomy rows (fixed slug set) from the previous full list unless edited via the taxonomy bridge.
 */
export function mergeSimpleRepeaterIntoFullPalette<
	T extends { slug?: unknown },
>(previousFull: T[], nextSimpleRows: T[], taxonomySlugSet: Set<string>): T[] {
	const nextSimpleBySlug = new Map(
		nextSimpleRows.map((r) => [String(r.slug ?? ''), r])
	);

	const stepped = previousFull.flatMap((row) => {
		const slug = String(row.slug ?? '');
		if (taxonomySlugSet.has(slug)) {
			return [row];
		}
		const replacement = nextSimpleBySlug.get(slug);
		if (!replacement) {
			return [];
		}
		return [replacement];
	});

	const existingSlugs = new Set(stepped.map((r) => String(r.slug ?? '')));
	const appended = nextSimpleRows.filter(
		(r) => !existingSlugs.has(String(r.slug ?? ''))
	);

	return [...stepped, ...appended];
}
