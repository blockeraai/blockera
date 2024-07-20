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

export const Inserter = ({
	callback,
	PlusButton,
	AvailableBlocks,
}: {
	insertArgs: Object,
	callback: () => void,
	PlusButton: ComponentType<any>,
	AvailableBlocks: ComponentType<any>,
}): MixedElement => {
	const [isOpenPicker, setOpenPicker] = useState(false);

	return (
		<>
			<PlusButton onClick={() => setOpenPicker(true)} />

			{isOpenPicker && (
				<Popover
					placement={'left-start'}
					onClose={() => setOpenPicker(false)}
					title={__('Select block/element', 'blockera')}
				>
					<AvailableBlocks onClick={callback} />
				</Popover>
			)}
		</>
	);
};
