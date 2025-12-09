// @flow
/**
 * External dependencies
 */
import type { Node } from 'react';
import { Tooltip as WPTooltip } from '@wordpress/components';
import { componentClassNames } from '@blockera/classnames';

/**
 * Int dependencies
 */
import type { TTooltipItem } from './types';

export function Tooltip({
	width = 'auto',
	hideOnClick = true,
	placement = 'top',
	position = 'top',
	delay = 600,
	children,
	className,
	text,
	style = {},
	...props
}: TTooltipItem): Node {
	return (
		<WPTooltip
			className={componentClassNames('tooltip', className)}
			hideOnClick={hideOnClick}
			placement={placement}
			position={position}
			text={
				<div
					className={componentClassNames(
						'tooltip-content',
						className
					)}
				>
					{text}
				</div>
			}
			delay={delay}
			style={{
				'--tooltip-padding': '8px',
				'--tooltip-width': width,
				...style,
			}}
			{...props}
		>
			{children}
		</WPTooltip>
	);
}
