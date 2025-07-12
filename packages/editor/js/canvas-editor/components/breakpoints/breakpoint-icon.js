//@flow
/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';
import { __, isRTL } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import {
	componentClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';
import { Tooltip, Flex } from '@blockera/controls';
import { isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { TBreakpoint } from '../../../extensions/libs/block-card/block-states/types';
import {
	isBaseBreakpoint,
	getBreakpointLongDescription,
	getBreakpointShortDescription,
} from './helpers';

export function BreakpointIcon({
	name,
	onClick,
	settings,
	className,
	isDefault = false,
	...props
}: {
	isDefault?: boolean,
	settings?: {
		min: string,
		max: string,
		icon: {
			icon: string,
			library: string,
			uploadSVG: string,
		},
		picked: boolean,
	},
	name: TBreakpoint,
	className?: string,
	onClick?: (event: MouseEvent) => void,
}): MixedElement {
	const { getBreakpoints } = select('blockera/editor');
	const breakpoints = getBreakpoints();

	if (isUndefined(breakpoints[name])) {
		return <></>;
	}

	return (
		<Tooltip
			width="250px"
			style={{ '--tooltip-padding': '16px' }}
			text={
				<>
					<h5>{breakpoints[name].label}</h5>

					{isBaseBreakpoint(name) ? (
						<Flex
							direction="row"
							gap="2px"
							justifyContent="flex-start"
							alignItems="center"
						>
							<Icon
								icon="asterisk"
								iconSize="20"
								style={
									isRTL()
										? { marginRight: '-5px' }
										: { marginLeft: '-5px' }
								}
							/>
							{getBreakpointShortDescription(name)}
						</Flex>
					) : (
						<p>{getBreakpointShortDescription(name)}</p>
					)}

					<p
						style={{
							color: '#b0b0b0',
						}}
					>
						{getBreakpointLongDescription(name)}
					</p>

					{isBaseBreakpoint(name) && (
						<p
							style={{
								color: '#b0b0b0',
							}}
						>
							{__('Start your styling here.', 'blockera')}
						</p>
					)}
				</>
			}
		>
			<div
				className={componentClassNames(
					'breakpoint-icon',
					'breakpoint-' + name,
					'breakpoint-icon-' +
						(settings ? settings.icon.icon : `device-${name}`),
					className
				)}
				aria-label={breakpoints[name].label}
				onClick={onClick}
				{...props}
			>
				{isBaseBreakpoint(name) && (
					<Icon
						icon="asterisk"
						iconSize="13"
						className={componentInnerClassNames(
							'base-breakpoint-icon'
						)}
					/>
				)}

				{settings && settings.icon?.icon && settings.icon?.library ? (
					<Icon
						{...{
							icon: settings
								? settings.icon.icon
								: `device-${name}`,
							...(settings
								? { library: settings.icon.library }
								: {}),
						}}
					/>
				) : (
					<Icon icon="border" library="wp" iconSize="24px" />
				)}

				{!isDefault && (
					<Icon
						icon="gear"
						iconSize="12"
						className={componentInnerClassNames(
							'custom-breakpoint-item'
						)}
					/>
				)}

				{/* <ChangeIndicator isChanged={true} /> */}
			</div>
		</Tooltip>
	);
}
