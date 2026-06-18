/**
 * Generic slug-map merge for taxonomy repeater payloads into a full baseline list.
 */
export function mergeTaxonomyRepeaterPayloadBySlug<
	T extends Record<string, unknown>,
>(
	payload: object,
	baselineItems: T[],
	convertPayload: (p: object, baseline: T[]) => T[]
): T[] {
	const nextTaxonomy = convertPayload(payload, baselineItems);
	const bySlug = new Map(
		nextTaxonomy.map((row) => [String(row.slug ?? ''), row])
	);
	return baselineItems.map((row) => {
		const slug = String(row.slug ?? '');
		const rep = bySlug.get(slug);
		return (rep ?? row) as T;
	});
}
