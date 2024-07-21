// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import { Popover } from '@blockera/controls';
import { classNames } from '@blockera/classnames';

export const Inserter = ({
	callback,
	maxItems,
	insertArgs,
	PlusButton,
	AvailableBlocks,
}: {
	maxItems: number,
	insertArgs: Object,
	callback: () => void,
	PlusButton: ComponentType<any>,
	AvailableBlocks: ComponentType<any>,
}): MixedElement => {
	const [isOpenPicker, setOpenPicker] = useState(false);

	return (
		<>
			<PlusButton
				onClick={() => {
					if (
						Object.keys(insertArgs?.repeaterItems).length >=
						maxItems
					) {
						return;
					}

					setOpenPicker(true);
				}}
				disabled={
					Object.keys(insertArgs?.repeaterItems).length >= maxItems
				}
			/>

			{isOpenPicker && (
				<Popover
					placement={'left-start'}
					onClose={() => setOpenPicker(false)}
					title={__('Select Block', 'blockera')}
					className={classNames('blockera-inner-blocks-picker')}
				>
					<AvailableBlocks onClick={callback} />
				</Popover>
			)}
		</>
	);
};
