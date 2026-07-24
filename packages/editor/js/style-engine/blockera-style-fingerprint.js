// @flow

/**
 * Stable fingerprint of Blockera-controlled attributes for style-engine memoization.
 *
 * @param {Object|null|undefined} attributes Block attributes.
 * @param {Object|null|undefined} inlineStyles Optional inline style overrides.
 * @return {string} Fingerprint string.
 */
export function getBlockeraStyleFingerprint(
	attributes: Object | null | undefined,
	inlineStyles?: Object | null
): string {
	if (!attributes) {
		return '';
	}

	const parts: Array<string> = [];

	for (const key of Object.keys(attributes).sort()) {
		if (key === 'className' || key.startsWith('blockera')) {
			parts.push(`${key}:${JSON.stringify(attributes[key])}`);
		}
	}

	if (inlineStyles && Object.keys(inlineStyles).length) {
		parts.push(`inline:${JSON.stringify(inlineStyles)}`);
	}

	return parts.join('|');
}

/**
 * @param {Object} props StateStyle props.
 * @param {Array<string>} states Resolved state list.
 * @param {Object} breakpoints Breakpoint map.
 * @return {string} Composite fingerprint for StateStyle memoization.
 */
export function getStateStyleFingerprint(
	props: Object,
	states: Array<string>,
	breakpoints: Object
): string {
	return [
		props.clientId,
		props.blockName,
		props.currentBlock,
		props.currentState,
		props.currentBreakpoint,
		props.currentInnerBlockState,
		props.isGlobalStylesWrapper ? '1' : '0',
		JSON.stringify(props.disabledStyles || []),
		states.join(','),
		Object.keys(breakpoints || {})
			.sort()
			.join(','),
		getBlockeraStyleFingerprint(props.attributes, props.inlineStyles),
	].join('\0');
}
