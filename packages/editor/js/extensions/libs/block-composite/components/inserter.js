// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { useState } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import { Popover } from '@blockera/controls';
import { classNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { TStates } from '../../block-card/block-states/types';

export const Inserter = ({
	callback,
	maxItems,
	insertArgs,
	PlusButton,
	currentState,
	AvailableBlocks,
	currentInnerBlockState,
}: {
	maxItems: number,
	insertArgs: Object,
	callback: () => void,
	currentState: TStates,
	PlusButton: ComponentType<any>,
	currentInnerBlockState: TStates,
	AvailableBlocks: ComponentType<any>,
}): MixedElement => {
	const [popoverAnchor, setPopoverAnchor] = useState(null);
	const [isOpenPicker, setOpenPicker] = useState(false);

	const { getState, getInnerState } = select('blockera/editor');
	const {
		settings: { supportsInnerBlocks },
	} = getState(currentState) ||
		getInnerState(currentInnerBlockState) || {
			settings: { supportsInnerBlocks: false },
		};

	return (
		<div>
			<PlusButton
				onClick={(props, event: MouseEvent) => {
					if (
						Object.keys(insertArgs?.repeaterItems).length >=
						maxItems
					) {
						return;
					}

					if (isOpenPicker) {
						setOpenPicker(false);
					} else {
						setPopoverAnchor(event.currentTarget); // the <button> element itself
						setOpenPicker(true);
					}
				}}
				disabled={
					Object.keys(insertArgs?.repeaterItems).length >= maxItems
				}
				isFocus={isOpenPicker}
			/>

			{isOpenPicker && popoverAnchor && (
				<Popover
					offset={12}
					placement="bottom-end"
					onClose={() => setOpenPicker(false)}
					title=""
					className={classNames('blockera-states-picker-popover')}
					anchor={popoverAnchor}
				>
					<AvailableBlocks
						onClick={callback}
						supportsInnerBlocks={supportsInnerBlocks}
					/>
				</Popover>
			)}
		</div>
	);
};
