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
import { Tooltip, Flex } from '@blockera/controls';
import { isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { TBreakpoint } from '../../../extensions/libs/block-states/types';
import {
	isBaseBreakpoint,
	getBreakpointLongDescription,
	getBreakpointShortDescription,
} from './helpers';
import { default as defaultBreakpoints } from '../../../extensions/libs/block-states/default-breakpoints';

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
	const breakpoints = defaultBreakpoints();

	if (isUndefined(breakpoints[name])) {
		return <></>;
	}

	return (
		<Tooltip
			width="220px"
			style={{ padding: '12px' }}
			text={
				<>
					<h5>{breakpoints[name].label}</h5>

					{isBaseBreakpoint(name) ? (
						<Flex
							direction="row"
							gap="0"
							justifyContent="flex-start"
							alignItems="center"
						>
							<Icon icon="asterisk" iconSize="20" />
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
					className
				)}
				aria-label={breakpoints[name].label}
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

				<Icon icon={'device-' + name} />

				{/* <ChangeIndicator isChanged={true} /> */}
			</div>
		</Tooltip>
	);
}