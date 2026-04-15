// @flow

/**
 * Shared transform string building for block attributes and global-styles preset preview.
 * Mirrors the switch in `styles.js` (blockeraTransform) using {@link getValueAddonRealValue}.
 *
 * Blockera dependencies
 */
import { getValueAddonRealValue, getSortedRepeater } from '@blockera/controls';

function getTransformEntries(blockeraTransformRepeater: mixed): mixed {
	if (
		!blockeraTransformRepeater ||
		(typeof blockeraTransformRepeater === 'object' &&
			!Array.isArray(blockeraTransformRepeater) &&
			!Object.keys(blockeraTransformRepeater).length)
	) {
		return [];
	}

	if (
		Array.isArray(blockeraTransformRepeater) &&
		blockeraTransformRepeater.length &&
		Array.isArray(blockeraTransformRepeater[0])
	) {
		return blockeraTransformRepeater;
	}

	return getSortedRepeater(blockeraTransformRepeater);
}

/**
 * @param {Object|Array} blockeraTransformRepeater Repeater map or sorted `[key, item]` tuples (same as `styles.js` after resolving variable vs store).
 * @return {string} Space-joined transform functions, or empty.
 */
export function joinTransformCssFromRepeaterMap(
	blockeraTransformRepeater: Object | Array<mixed>
): string {
	const sorted: Array<mixed> = (getTransformEntries(
		blockeraTransformRepeater
	): any);
	const parts: string[] = [];

	sorted.forEach((entry: mixed) => {
		if (!Array.isArray(entry)) {
			return;
		}
		const row: any = entry[1];
		if (!row || row.isVisible === false) {
			return;
		}

		switch (row.type) {
			case 'move':
				parts.push(
					`translate3d(${getValueAddonRealValue(
						row['move-x']
					)}, ${getValueAddonRealValue(
						row['move-y']
					)}, ${getValueAddonRealValue(row['move-z'])})`
				);
				break;

			case 'scale':
				parts.push(
					`scale3d(${getValueAddonRealValue(
						row.scale
					)}, ${getValueAddonRealValue(row.scale)}, 50%)`
				);
				break;

			case 'rotate':
				parts.push(
					`rotateX(${getValueAddonRealValue(
						row['rotate-x']
					)}) rotateY(${getValueAddonRealValue(
						row['rotate-y']
					)}) rotateZ(${getValueAddonRealValue(row['rotate-z'])})`
				);
				break;

			case 'skew':
				parts.push(
					`skew(${getValueAddonRealValue(
						row['skew-x']
					)}, ${getValueAddonRealValue(row['skew-y'])})`
				);
				break;
			default:
				break;
		}
	});

	return parts.join(' ');
}
