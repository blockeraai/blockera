// @flow

/**
 * External dependencies
 */
import { useMemo, useRef } from '@wordpress/element';
import { BlockPreview } from '@wordpress/block-editor';
import { getBlockType, getBlockFromExample } from '@wordpress/blocks';
import { __experimentalSpacer as Spacer } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { isEquals } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { getVariationClassName } from './utils';
import { useBlockContext } from '../../../extensions/components/block-context';
import { useBlockPreviewStyles } from '../../../hooks/use-block-preview-styles';

// Same as height of InserterPreviewPanel.
const PREVIEW_HEIGHT = 144;
const SIDEBAR_WIDTH = 235;

const BlockPreviewPanel = ({
	name,
	variation = '',
}: {
	name: string,
	variation: string,
}): Object => {
	const { getAttributes } = useBlockContext();

	// Memoize attributes with deep comparison to prevent unnecessary re-renders
	// when getAttributes() returns a new object reference with the same values
	const attributesRef = useRef(null);
	const stableAttributesRef = useRef(null);

	// Get current attributes - call on every render to get latest values
	const currentAttributes = getAttributes();

	// Compare with previous value and return stable reference if values unchanged
	const attributes = useMemo(() => {
		// Deep compare with previous value stored in ref
		if (
			attributesRef.current === null ||
			!isEquals(attributesRef.current, currentAttributes)
		) {
			// Values actually changed, update both refs
			attributesRef.current = currentAttributes;
			stableAttributesRef.current = currentAttributes;
		}
		// Return stable reference (previous value if unchanged, new value if changed)
		// This prevents child components from re-rendering when only reference changed
		return stableAttributesRef.current;
		// currentAttributes dependency ensures we check on every render
		// but deep comparison prevents unnecessary updates
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentAttributes]);

	// Memoize blockType lookup - only recalculate when name changes
	const blockType = useMemo(() => getBlockType(name), [name]);

	// Extract blockExample once and memoize - depends on blockType which is already memoized
	const blockExample = useMemo(() => blockType?.example, [blockType]);

	// Memoize blocks generation - depends on name, blockExample, and variation
	const blocks = useMemo(() => {
		if (!blockExample) {
			return null;
		}

		const example = {
			...blockExample,
			attributes: {
				...blockExample.attributes,
				style: undefined,
				className: variation
					? getVariationClassName(variation)
					: blockExample.attributes?.className,
			},
		};

		return getBlockFromExample(name, example);
	}, [name, blockExample, variation]);

	// Memoize viewport calculations - only recalculate when blockExample changes
	const { viewportWidth, minHeight } = useMemo(() => {
		const vw = blockExample?.viewportWidth ?? 500;
		const scale = SIDEBAR_WIDTH / vw;
		const mh =
			scale !== 0 && scale < 1 && PREVIEW_HEIGHT
				? PREVIEW_HEIGHT / scale
				: PREVIEW_HEIGHT;

		return {
			viewportWidth: vw,
			minHeight: mh,
		};
	}, [blockExample?.viewportWidth]);

	// Use memoized attributes to prevent unnecessary re-renders
	const blockPreviewCssStyles = useBlockPreviewStyles(
		blockType,
		variation,
		attributes
	);

	// Memoize CSS string - only recalculate when minHeight changes
	const baseCssStyles = useMemo(
		() => `
			body{
				padding: 24px;
				min-height:${Math.round(minHeight)}px;
				display:flex;
				align-items:center;
			}
			.is-root-container { width: 100%; }
		`,
		[minHeight]
	);

	// Memoize additionalStyles array - only recreate when styles change
	const additionalStyles = useMemo(() => {
		const styles = [
			{
				css: baseCssStyles,
			},
		];

		// Only add blockPreviewCssStyles if it exists and is not empty
		if (blockPreviewCssStyles) {
			styles.push({ css: blockPreviewCssStyles });
		}

		return styles;
	}, [baseCssStyles, blockPreviewCssStyles]);

	// Early return if no example - avoid rendering work
	if (!blockExample) {
		return null;
	}

	return (
		<Spacer marginX={4} marginBottom={4}>
			<div
				className="edit-site-global-styles__block-preview-panel"
				style={{
					maxHeight: PREVIEW_HEIGHT,
					boxSizing: 'initial',
				}}
			>
				<BlockPreview
					blocks={blocks}
					viewportWidth={viewportWidth}
					minHeight={PREVIEW_HEIGHT}
					additionalStyles={additionalStyles}
				/>
			</div>
		</Spacer>
	);
};

export default BlockPreviewPanel;
