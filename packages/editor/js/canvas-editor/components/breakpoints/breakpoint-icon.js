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
import {
	componentClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { TBreakpoint } from '../../../extensions/libs/block-states/types';
import { isBaseBreakpoint } from './helpers';

export function BreakpointIcon({
	name,
	onClick,
	className,
	...props
}: {
	name: TBreakpoint,
	className?: string,
	onClick?: (event: MouseEvent) => void,
}): MixedElement {
	switch (name) {
		case 'laptop':
			return (
				<div
					className={componentClassNames(
						'breakpoint-icon',
						'breakpoint-' + name,
						className
					)}
					aria-label={__('Laptop', 'blockera')}
					onClick={onClick}
					{...props}
				>
					{isBaseBreakpoint(name) && (
						<Icon
							icon="asterisk"
							iconSize="12"
							className={componentInnerClassNames(
								'base-breakpoint-icon'
							)}
						/>
					)}

					<Icon icon="device-laptop" />

					{/* <ChangeIndicator isChanged={true} /> */}
				</div>
			);

		case 'desktop':
			return (
				<div
					className={componentClassNames(
						'breakpoint-icon',
						'breakpoint-' + name,
						className
					)}
					aria-label={__('Desktop', 'blockera')}
					onClick={onClick}
					{...props}
				>
					{isBaseBreakpoint(name) && (
						<Icon
							icon="asterisk"
							iconSize="12"
							className={componentInnerClassNames(
								'base-breakpoint-icon'
							)}
						/>
					)}

					<Icon icon="device-desktop" />

					{/* <ChangeIndicator isChanged={true} /> */}
				</div>
			);

		case 'tablet':
			return (
				<div
					className={componentClassNames(
						'breakpoint-icon',
						'breakpoint-' + name,
						className
					)}
					aria-label={__('Tablet', 'blockera')}
					onClick={onClick}
					{...props}
				>
					{isBaseBreakpoint(name) && (
						<Icon
							icon="asterisk"
							iconSize="12"
							className={componentInnerClassNames(
								'base-breakpoint-icon'
							)}
						/>
					)}

					<Icon icon="device-tablet" />

					{/* <ChangeIndicator isChanged={true} /> */}
				</div>
			);

		case 'mobile':
			return (
				<div
					className={componentClassNames(
						'breakpoint-icon',
						'breakpoint-' + name,
						className
					)}
					aria-label={__('Mobile', 'blockera')}
					onClick={onClick}
					{...props}
				>
					{isBaseBreakpoint(name) && (
						<Icon
							icon="asterisk"
							iconSize="12"
							className={componentInnerClassNames(
								'base-breakpoint-icon'
							)}
						/>
					)}

					<Icon icon="device-mobile" />

					{/* <ChangeIndicator isChanged={true} /> */}
				</div>
			);

		case 'mobile-landscape':
			return (
				<div
					className={componentClassNames(
						'breakpoint-icon',
						'breakpoint-' + name,
						className
					)}
					aria-label={__('Mobile Landscape', 'blockera')}
					onClick={onClick}
					{...props}
				>
					{isBaseBreakpoint(name) && (
						<Icon
							icon="asterisk"
							iconSize="12"
							className={componentInnerClassNames(
								'base-breakpoint-icon'
							)}
						/>
					)}

					<Icon icon="device-mobile-landscape" />

					{/* <ChangeIndicator isChanged={true} /> */}
				</div>
			);

		case 'large':
			return (
				<div
					className={componentClassNames(
						'breakpoint-icon',
						'breakpoint-' + name,
						className
					)}
					aria-label={__('Large Screen', 'blockera')}
					onClick={onClick}
					{...props}
				>
					{isBaseBreakpoint(name) && (
						<Icon
							icon="asterisk"
							iconSize="12"
							className={componentInnerClassNames(
								'base-breakpoint-icon'
							)}
						/>
					)}

					<Icon icon="device-large" />

					{/* <ChangeIndicator isChanged={true} /> */}
				</div>
			);

		case 'extra-large':
			return (
				<div
					className={componentClassNames(
						'breakpoint-icon',
						'breakpoint-' + name,
						className
					)}
					aria-label={__('Extra Large Screen', 'blockera')}
					onClick={onClick}
					{...props}
				>
					{isBaseBreakpoint(name) && (
						<Icon
							icon="asterisk"
							iconSize="12"
							className={componentInnerClassNames(
								'base-breakpoint-icon'
							)}
						/>
					)}

					<Icon icon="device-extra-large" />

					{/* <ChangeIndicator isChanged={true} /> */}
				</div>
			);

		default:
			return <></>;
	}
}
