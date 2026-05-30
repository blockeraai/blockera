// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { alignLeft, alignCenter, alignRight } from '@wordpress/icons';
import type { MixedElement } from 'react';
import { useLayoutEffect, useRef, useCallback } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { useDisplayBlockControls } from '../../../../hooks/use-display-block-controls';
import {
	shouldUseBlockeraTextAlignToolbar,
	BLOCKERA_TEXT_ALIGN_TOOLBAR_TEST_ID,
} from '../hide-core-text-align-toolbar';
import '../style.scss';
import type { THandleOnChangeAttributes } from '../../types';

const TEXT_ALIGNMENT_CONTROLS = [
	{
		icon: alignLeft,
		title: __('Align text left', 'blockera'),
		align: 'left',
	},
	{
		icon: alignCenter,
		title: __('Align text center', 'blockera'),
		align: 'center',
	},
	{
		icon: alignRight,
		title: __('Align text right', 'blockera'),
		align: 'right',
	},
];

const VALID_TOOLBAR_ALIGNMENTS = new Set(['left', 'center', 'right']);

const blockeraValueToToolbarValue = (value: ?string): ?string => {
	if (!value || value === 'initial' || !VALID_TOOLBAR_ALIGNMENTS.has(value)) {
		return undefined;
	}

	return value;
};

const toolbarValueToBlockeraValue = (value: ?string): string => {
	if (!value || !VALID_TOOLBAR_ALIGNMENTS.has(value)) {
		return '';
	}

	return value;
};

export const BlockeraTextAlignToolbar = ({
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
		() => shouldUseBlockeraTextAlignToolbar(blockName),
		[blockName]
	);

	// Hardcoded block-library toolbars: tag groups so DOM hide skips Blockera.
	useLayoutEffect(() => {
		const marker = toolbarMarkerRef.current;

		if (!marker) {
			return;
		}

		marker.setAttribute('data-test', BLOCKERA_TEXT_ALIGN_TOOLBAR_TEST_ID);

		marker
			.querySelectorAll('.components-toolbar-group')
			.forEach((group) => {
				group.setAttribute(
					'data-test',
					BLOCKERA_TEXT_ALIGN_TOOLBAR_TEST_ID
				);
			});
	});

	const handleToolbarAlignChange = useCallback(
		(nextAlign: ?string) => {
			handleOnChangeAttributes(
				'blockeraTextAlign',
				toolbarValueToBlockeraValue(nextAlign),
				{}
			);
		},
		[handleOnChangeAttributes]
	);

	if (!displayBlockControls || !shouldShowToolbar) {
		return null;
	}

	const toolbarValue = blockeraValueToToolbarValue(
		currentAttributes?.blockeraTextAlign
	);

	return (
		<BlockControls group="block">
			<div
				data-test={BLOCKERA_TEXT_ALIGN_TOOLBAR_TEST_ID}
				ref={toolbarMarkerRef}
			>
				<AlignmentToolbar
					value={toolbarValue}
					onChange={handleToolbarAlignChange}
					alignmentControls={TEXT_ALIGNMENT_CONTROLS}
				/>
			</div>
		</BlockControls>
	);
};
