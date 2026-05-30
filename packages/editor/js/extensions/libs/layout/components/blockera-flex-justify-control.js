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
import { getHorizontalScreenToolbarControls } from './flex-toolbar-control-config';

export const BlockeraFlexJustifyControl = ({
	direction,
	value,
	onChange,
}: {
	direction: string,
	value: ?string,
	onChange: (?string) => void,
}): MixedElement | null => {
	const controls = useMemo(
		() => getHorizontalScreenToolbarControls(direction),
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
