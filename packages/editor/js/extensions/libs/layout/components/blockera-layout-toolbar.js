// @flow

/**
 * External dependencies
 */
import { BlockControls } from '@wordpress/block-editor';
import type { MixedElement } from 'react';
import {
	useLayoutEffect,
	useRef,
	useCallback,
	useMemo,
} from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * Blockera Dependencies
 */
import { Flex } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { useDisplayBlockControls } from '../../../../hooks/use-display-block-controls';
import {
	shouldUseBlockeraLayoutToolbar,
	shouldShowBlockeraFlexLayoutToolbar,
	BLOCKERA_LAYOUT_TOOLBAR_TEST_ID,
} from '../hide-core-layout-toolbar';
import { BlockeraFlexJustifyControl } from './blockera-flex-justify-control';
import { BlockeraFlexVerticalAlignmentControl } from './blockera-flex-vertical-alignment-control';
import {
	blockeraFlexLayoutToToolbarValues,
	applyHorizontalToolbarToBlockeraFlexLayout,
	applyVerticalToolbarToBlockeraFlexLayout,
} from '../compatibility/flex-layout';
import type { THandleOnChangeAttributes } from '../../types';

export const BlockeraLayoutToolbar = ({
	blockName,
	currentAttributes,
	handleOnChangeAttributes,
}: {
	blockName: string,
	currentAttributes: Object,
	handleOnChangeAttributes: THandleOnChangeAttributes,
}): MixedElement | null => {
	const displayBlockControls = useDisplayBlockControls();
	const toolbarMarkerRef = useRef<?HTMLElement>(null);
	const shouldShowToolbar = useSelect(
		() => shouldUseBlockeraLayoutToolbar(blockName),
		[blockName]
	);

	const flexLayout = useMemo(
		() => currentAttributes?.blockeraFlexLayout || {},
		[currentAttributes?.blockeraFlexLayout]
	);
	const isFlexDisplay = shouldShowBlockeraFlexLayoutToolbar(
		blockName,
		currentAttributes
	);

	const { horizontalValue, verticalValue, direction } = useMemo(
		() => blockeraFlexLayoutToToolbarValues(flexLayout),
		[flexLayout]
	);

	// Hardcoded block-library toolbars: tag groups so DOM hide skips Blockera.
	useLayoutEffect(() => {
		const marker = toolbarMarkerRef.current;

		if (!marker) {
			return;
		}

		marker.setAttribute('data-test', BLOCKERA_LAYOUT_TOOLBAR_TEST_ID);

		marker
			.querySelectorAll('.components-toolbar-group')
			.forEach((group) => {
				group.setAttribute(
					'data-test',
					BLOCKERA_LAYOUT_TOOLBAR_TEST_ID
				);
			});
	});

	const handleHorizontalChange = useCallback(
		(nextValue: ?string) => {
			handleOnChangeAttributes(
				'blockeraFlexLayout',
				applyHorizontalToolbarToBlockeraFlexLayout(
					flexLayout,
					nextValue
				),
				{}
			);
		},
		[flexLayout, handleOnChangeAttributes]
	);

	const handleVerticalChange = useCallback(
		(nextValue: ?string) => {
			handleOnChangeAttributes(
				'blockeraFlexLayout',
				applyVerticalToolbarToBlockeraFlexLayout(flexLayout, nextValue),
				{}
			);
		},
		[flexLayout, handleOnChangeAttributes]
	);

	if (!displayBlockControls || !shouldShowToolbar || !isFlexDisplay) {
		return null;
	}

	return (
		<BlockControls group="block">
			<Flex
				direction="row"
				gap="0"
				data-test={BLOCKERA_LAYOUT_TOOLBAR_TEST_ID}
				ref={toolbarMarkerRef}
			>
				<BlockeraFlexJustifyControl
					direction={direction}
					value={horizontalValue}
					onChange={handleHorizontalChange}
				/>
				<BlockeraFlexVerticalAlignmentControl
					direction={direction}
					value={verticalValue}
					onChange={handleVerticalChange}
				/>
			</Flex>
		</BlockControls>
	);
};
