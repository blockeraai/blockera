/**
 * External dependencies
 */
import { __experimentalItemGroup as WPItemGroup } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { type ItemGroupProps } from './types';

export const ItemGroup = (props: ItemGroupProps) => {
	return <WPItemGroup {...props}>{props?.children || <></>}</WPItemGroup>;
};
