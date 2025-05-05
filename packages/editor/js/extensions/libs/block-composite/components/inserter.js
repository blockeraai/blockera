// @flow

/**
 * External dependencies
 */
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
		<div>
			<PlusButton
				onClick={() => {
					if (
						Object.keys(insertArgs?.repeaterItems).length >=
						maxItems
					) {
						return;
					}

					setOpenPicker(!isOpenPicker);
				}}
				disabled={
					Object.keys(insertArgs?.repeaterItems).length >= maxItems
				}
				isFocus={isOpenPicker}
			/>

			{isOpenPicker && (
				<Popover
					offset={12}
					placement="bottom-end"
					onClose={() => setOpenPicker(false)}
					title=""
					className={classNames('blockera-states-picker-popover')}
				>
					<AvailableBlocks onClick={callback} />
				</Popover>
			)}
		</div>
	);
};
