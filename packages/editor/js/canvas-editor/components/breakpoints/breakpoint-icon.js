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
import type { TBreakpoint } from '../../../extensions/libs/block-states/types';
import {
	isBaseBreakpoint,
	getBreakpointLongDescription,
	getBreakpointShortDescription,
} from './helpers';

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
	const { getBreakpoints } = select('blockera/editor');
	const breakpoints = getBreakpoints();

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

				<Icon icon={'device-' + name} />

				{/* <ChangeIndicator isChanged={true} /> */}
			</div>
		</Tooltip>
	);
}
