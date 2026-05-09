/**
 * Repeater object keys often do not match preset slugs; resolve the real item id for updates.
 */
export function findRepeaterItemIdBySlug(
	repeaterItems: Record<string, { slug?: string }> | undefined,
	targetSlug: string
): string | number | null {
	if (!repeaterItems) {
		return null;
	}
	for (const [id, row] of Object.entries(repeaterItems)) {
		if (String(row?.slug ?? '') === targetSlug) {
			return id;
		}
	}
	return null;
}
