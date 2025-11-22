// @flow

/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import type { MixedElement } from 'react';
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

export const UsageForMultipleBlocksModal = ({
	style,
	blockName,
	blockTitle,
	handleOnUsageForMultipleBlocks,
	setIsOpenUsageForMultipleBlocks,
}: {
	style: Object,
	blockName: string,
	blockTitle: string,
	handleOnUsageForMultipleBlocks: (
		style: Object,
		action: 'add' | 'delete'
	) => void,
	setIsOpenUsageForMultipleBlocks: (isOpen: boolean) => void,
}): MixedElement => {
	const blocks = getBlockTypes();

	return (
		<Modal
			size="large"
			className={componentInnerClassNames('style-variation-modal')}
			headerIcon={<Icon icon="block-types" iconSize="34" />}
			headerTitle={sprintf(
				/* translators: $1%s is a style name. */
				__('Use “%1$s” for Multiple Blocks', 'blockera'),
				style.label
			)}
			isDismissible={true}
			onRequestClose={() => setIsOpenUsageForMultipleBlocks(false)}
		>
			<SearchBlockTypes
				style={style}
				blocks={blocks}
				blockName={blockName}
				blockTitle={blockTitle}
				setIsOpenUsageForMultipleBlocks={
					setIsOpenUsageForMultipleBlocks
				}
				handleOnUsageForMultipleBlocks={handleOnUsageForMultipleBlocks}
			/>
		</Modal>
	);
};
