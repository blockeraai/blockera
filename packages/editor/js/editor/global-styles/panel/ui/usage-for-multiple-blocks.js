// @flow

/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useCallback } from '@wordpress/element';
import { getBlockTypes } from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { Modal } from '@blockera/controls';
import { componentInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { SearchBlockTypes } from './search-block-types';
import { useCompanionGatedVariationAction } from './use-companion-gated-variation-action';

export const UsageForMultipleBlocksModal = ({
	style,
	blockName,
	blockTitle,
	handleOnUsageForMultipleBlocks,
	handleOnSaveUsageForMultipleBlocks,
	setIsOpenUsageForMultipleBlocks,
}: {
	style: Object,
	blockName: string,
	blockTitle: string,
	handleOnUsageForMultipleBlocks: (
		style: Object,
		action: 'add' | 'delete'
	) => void,
	handleOnSaveUsageForMultipleBlocks: (params: Object) => void,
	setIsOpenUsageForMultipleBlocks: (isOpen: boolean) => void,
}): MixedElement => {
	const blocks = getBlockTypes();
	const { gateVariationAction, companionInstallModal, isCompanionModalOpen } =
		useCompanionGatedVariationAction();

	const gatedHandleOnUsageForMultipleBlocks = useCallback(
		(styleParam: Object, action: 'add' | 'delete') => {
			gateVariationAction(() => {
				handleOnUsageForMultipleBlocks(styleParam, action);
			});
		},
		[gateVariationAction, handleOnUsageForMultipleBlocks]
	);

	const gatedHandleOnSaveUsageForMultipleBlocks = useCallback(
		(params: Object) => {
			gateVariationAction(() => {
				handleOnSaveUsageForMultipleBlocks(params);
			});
		},
		[gateVariationAction, handleOnSaveUsageForMultipleBlocks]
	);

	const handleShareModalClose = useCallback(() => {
		if (isCompanionModalOpen) {
			return;
		}

		setIsOpenUsageForMultipleBlocks(false);
	}, [isCompanionModalOpen, setIsOpenUsageForMultipleBlocks]);

	return (
		<Modal
			size="large"
			className={componentInnerClassNames('style-variation-modal')}
			headerIcon={<Icon icon="block-types" iconSize="34" />}
			headerTitle={sprintf(
				/* translators: %1$s: The style name. */
				__('Share "%1$s" with Other Blocks', 'blockera'),
				style.label
			)}
			isDismissible={true}
			onRequestClose={handleShareModalClose}
			shouldCloseOnClickOutside={!isCompanionModalOpen}
			shouldCloseOnEsc={!isCompanionModalOpen}
		>
			<SearchBlockTypes
				style={style}
				blocks={blocks}
				blockName={blockName}
				blockTitle={blockTitle}
				gateVariationAction={gateVariationAction}
				setIsOpenUsageForMultipleBlocks={
					setIsOpenUsageForMultipleBlocks
				}
				handleOnUsageForMultipleBlocks={
					gatedHandleOnUsageForMultipleBlocks
				}
				handleOnSaveUsageForMultipleBlocks={
					gatedHandleOnSaveUsageForMultipleBlocks
				}
			/>
			{companionInstallModal}
		</Modal>
	);
};
