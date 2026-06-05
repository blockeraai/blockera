// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BlockFillPartials } from './block-fill-partials';
import { useBlockStyleVariations } from '../../hooks/use-block-style-variations';
import {
	VARIATION_SURFACE_SIZE,
	VARIATION_SURFACE_STYLE,
} from '../../editor/global-styles/panel/variation-surfaces';

type ChangesetsBridge = {
	setChangesets: (flag: boolean) => void,
};

/**
 * Inspector-only fills with style/size variation hooks.
 * Mounted only for the selected block so inserter hover does not run these hooks on every block.
 */
export function BlockBaseInspectorBundle({
	changesetsBridgeRef,
	hasStyleVariations,
	hasSizeVariations,
	fillPartialsProps,
	styleVariationsConfig,
}: {
	changesetsBridgeRef: { current: ChangesetsBridge },
	hasStyleVariations: boolean,
	hasSizeVariations: boolean,
	fillPartialsProps: Object,
	styleVariationsConfig: Object,
}): MixedElement {
	const blockStyleVariationsProps = useBlockStyleVariations({
		...styleVariationsConfig,
		variationSurface: VARIATION_SURFACE_STYLE,
		enabled: hasStyleVariations,
	});
	const blockSizeVariationsProps = useBlockStyleVariations({
		...styleVariationsConfig,
		variationSurface: VARIATION_SURFACE_SIZE,
		enabled: hasSizeVariations,
	});

	useEffect(() => {
		changesetsBridgeRef.current = {
			setChangesets: (flag: boolean) => {
				blockStyleVariationsProps.setChangesets(flag);
				blockSizeVariationsProps.setChangesets(flag);
			},
		};

		return () => {
			changesetsBridgeRef.current = {
				setChangesets: () => {},
			};
		};
	}, [
		blockStyleVariationsProps,
		blockSizeVariationsProps,
		changesetsBridgeRef,
	]);

	return (
		<BlockFillPartials
			{...fillPartialsProps}
			blockStyleVariationsProps={blockStyleVariationsProps}
			blockSizeVariationsProps={blockSizeVariationsProps}
		/>
	);
}
