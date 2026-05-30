// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BlockeraFlexToolbarDropdown } from './blockera-flex-toolbar-dropdown';
import { getVerticalScreenToolbarControls } from './flex-toolbar-control-config';

export const BlockeraFlexVerticalAlignmentControl = ({
	direction,
	value,
	onChange,
}: {
	direction: string,
	value: ?string,
	onChange: (?string) => void,
}): MixedElement | null => {
	const controls = useMemo(
		() => getVerticalScreenToolbarControls(direction),
		[direction]
	);

	return (
		<BlockeraFlexToolbarDropdown
			direction={direction}
			value={value}
			onChange={onChange}
			controls={controls}
		/>
	);
};
