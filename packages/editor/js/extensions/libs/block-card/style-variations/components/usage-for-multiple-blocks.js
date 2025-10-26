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
	clientId,
	handleOnUsageForMultipleBlocks,
	setIsOpenUsageForMultipleBlocks,
}: {
	style: Object,
	clientId: string,
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
			className={componentInnerClassNames('rename-modal')}
			headerIcon={<Icon icon="attachment" iconSize="34" />}
			headerTitle={
				// $FlowFixMe
				<>
					<Icon icon="block-types" iconSize="34" />
					{sprintf(
						/* translators: $1%s is a style name. */
						__('Use “%1$s” for Multiple Blocks', 'blockera'),
						style.label
					)}
				</>
			}
			isDismissible={true}
			onRequestClose={() => setIsOpenUsageForMultipleBlocks(false)}
		>
			<SearchBlockTypes
				style={style}
				blocks={blocks}
				clientId={clientId}
				handleOnUsageForMultipleBlocks={handleOnUsageForMultipleBlocks}
			/>
		</Modal>
	);
};
