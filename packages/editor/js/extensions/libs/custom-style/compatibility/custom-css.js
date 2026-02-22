// @flow

/**
 * WordPress Custom CSS compatibility for block inspector and global styles.
 *
 * WordPress 6.2+ stores per-block custom CSS in:
 * - Block Inspector: attributes.style.css
 * - Global Styles: styles.blocks[blockName].css or styles.blocks[blockName].variations[styleName].css
 *
 * @see https://make.wordpress.org/core/2023/03/06/custom-css-for-global-styles-and-per-block/
 */

/**
 * Internal dependencies
 */
import { runInsideBlockInspector } from '../../utils';

/**
 * Migrate WordPress custom CSS to Blockera blockeraCustomCSS format.
 *
 * @param {Object} params
 * @param {Object} params.attributes - Block attributes
 * @param {boolean} [params.insideBlockInspector=true] - Whether in block inspector context
 * @param {'save-customizations' | 'detach-style'} [params.editorSelectedBlockEvent] - Editor event
 * @return {Object} Modified attributes with blockeraCustomCSS populated from WP when applicable
 */
export function customCssFromWPCompatibility({
	attributes,
	insideBlockInspector = true,
	editorSelectedBlockEvent,
}: {
	attributes: Object,
	insideBlockInspector?: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
}): Object {
	const blockeraValue = attributes?.blockeraCustomCSS?.value;
	const hasBlockeraValue =
		typeof blockeraValue === 'string' &&
		'' !== blockeraValue.trim() &&
		'& {\n    \n}\n' !== blockeraValue;

	if (hasBlockeraValue) {
		return attributes;
	}

	// Block Inspector: attributes.style.css
	// Global Styles: attributes.css (root-level in theme.json blocks[blockName])
	const wpCss = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? attributes?.style?.css
		: attributes?.css;

	if ('string' === typeof wpCss && '' !== wpCss.trim()) {
		attributes.blockeraCustomCSS = {
			...(attributes.blockeraCustomCSS || {}),
			value: /\{[^}]*\}/.test(wpCss)
				? wpCss.trim()
				: `& {\n    ${wpCss.trim()}\n}\n`,
		};
	}

	return attributes;
}

/**
 * Convert Blockera blockeraCustomCSS to WordPress format.
 *
 * @param {Object} params
 * @param {string} params.newValue - New CSS value from Blockera control
 * @param {Object} [params.ref] - Control context ref (ref.current.action: 'reset' for clear)
 * @param {boolean} [params.insideBlockInspector=true] - Whether in block inspector context
 * @param {'save-customizations' | 'detach-style'} [params.editorSelectedBlockEvent] - Editor event
 * @return {Object} WP-compatible attribute update (style.css or css)
 */
export function customCssToWPCompatibility({
	newValue,
	ref,
	insideBlockInspector = true,
	editorSelectedBlockEvent,
}: {
	newValue: string,
	ref?: Object,
	insideBlockInspector?: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
}): Object {
	const isReset = ref?.current?.action === 'reset';
	const isEmpty =
		!newValue || (typeof newValue === 'string' && newValue.trim() === '');
	const valueToSet = isReset || isEmpty ? undefined : newValue;

	return runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? {
				style: {
					css: valueToSet,
				},
			}
		: {
				css: valueToSet,
			};
}
