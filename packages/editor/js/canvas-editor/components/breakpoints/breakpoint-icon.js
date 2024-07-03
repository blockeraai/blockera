//@flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { TBreakpoint } from '../../../extensions/libs/block-states/types';

export function BreakpointIcon({
	name,
	onClick,
	...props
}: {
	name: TBreakpoint,
	className?: string,
	onClick?: (event: MouseEvent) => void,
}): MixedElement {
	switch (name) {
		case 'laptop':
			return (
				<Icon
					icon="device-laptop"
					aria-label={__('Laptop', 'blockera')}
					onClick={onClick}
					{...props}
				/>
			);

		case 'desktop':
			return (
				<Icon
					icon="device-desktop"
					aria-label={__('Desktop', 'blockera')}
					onClick={onClick}
					{...props}
				/>
			);

		case 'tablet':
			return (
				<Icon
					icon="device-tablet"
					aria-label={__('Tablet', 'blockera')}
					onClick={onClick}
					{...props}
				/>
			);

		case 'mobile':
			return (
				<Icon
					icon="device-mobile"
					aria-label={__('Mobile', 'blockera')}
					onClick={onClick}
					{...props}
				/>
			);

		case 'mobile-landscape':
			return (
				<Icon
					icon="device-mobile-landscape"
					aria-label={__('Mobile Landscape', 'blockera')}
					onClick={onClick}
					{...props}
				/>
			);

		case 'large':
			return (
				<Icon
					icon="device-large"
					aria-label={__('Large Screen', 'blockera')}
					onClick={onClick}
					{...props}
				/>
			);

		case 'extra-large':
			return (
				<Icon
					icon="device-extra-large"
					aria-label={__('Extra Large Screen', 'blockera')}
					onClick={onClick}
					{...props}
				/>
			);

		default:
			return <></>;
	}
}
